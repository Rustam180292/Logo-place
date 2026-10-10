-- =============================================================================
-- Logoped Topish — Supabase sxemasi
--
-- Ishga tushirish: Supabase panelida SQL Editor -> shu faylni to'liq bajarish.
-- Keyin `seed.sql` ni bajarib, namuna markazlarni qo'shish mumkin.
-- =============================================================================

-- Reklama/joylashtirish darajasi.
--   free     — oddiy ko'rinish
--   standard — nishon va haritada kattaroq belgi
--   premium  — ro'yxat boshidagi ochiq "Reklama" blokida ham ko'rinadi
do $$
begin
  if not exists (select 1 from pg_type where typname = 'center_tier') then
    create type center_tier as enum ('free', 'standard', 'premium');
  end if;
end $$;

create table if not exists public.centers (
  id              uuid primary key default gen_random_uuid(),

  -- Nomi va tavsifi ikki tilda; `_ru` bo'sh bo'lsa ilova o'zbekchasini ko'rsatadi.
  name            text        not null,
  name_ru         text,
  description     text,
  description_ru  text,

  address         text        not null,
  address_ru      text,
  city            text        not null default 'Toshkent',
  district        text,

  -- Koordinatalar. Masofa ilova tomonida hisoblanadi, shuning uchun
  -- PostGIS shart emas; qidiruv uchun oddiy indeks yetarli.
  lat             double precision not null check (lat between -90 and 90),
  lng             double precision not null check (lng between -180 and 180),

  phone           text        not null,
  phone_alt       text,
  telegram        text,
  instagram       text,
  website         text,

  -- Xizmat va yosh guruhi kalitlari ilovadagi i18n kalitlariga mos keladi
  -- (masalan 'speech_delay' -> 'service.speech_delay').
  services        text[]      not null default '{}',
  age_groups      text[]      not null default '{}',

  price_from      integer     check (price_from is null or price_from >= 0),
  price_note      text,
  price_note_ru   text,

  -- Kun bo'yicha ish vaqti, masalan:
  -- {"mon": {"open": "09:00", "close": "18:00"}, "sun": null}
  working_hours   jsonb,

  rating          numeric(2,1) check (rating is null or rating between 0 and 5),
  reviews_count   integer     not null default 0 check (reviews_count >= 0),
  photos          text[]      not null default '{}',

  tier            center_tier not null default 'free',
  is_verified     boolean     not null default false,
  is_active       boolean     not null default true,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Ilova faqat faol markazlarni so'raydi.
create index if not exists centers_active_idx on public.centers (is_active);
create index if not exists centers_tier_idx   on public.centers (tier);
create index if not exists centers_coords_idx on public.centers (lat, lng);
create index if not exists centers_district_idx on public.centers (district);

-- Nom va manzil bo'yicha matnli qidiruv uchun.
create index if not exists centers_search_idx on public.centers
  using gin (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(name_ru, '') || ' ' || coalesce(address, '')));

-- -----------------------------------------------------------------------------
-- Markaz egalarining arizalari (reklama/joylashtirish uchun)
-- -----------------------------------------------------------------------------
create table if not exists public.center_leads (
  id            uuid primary key default gen_random_uuid(),
  center_name   text not null,
  contact_name  text not null,
  phone         text not null,
  city          text not null default 'Toshkent',
  note          text,
  -- Ariza ko'rib chiqilgani holati: new -> contacted -> published | rejected
  status        text not null default 'new',
  created_at    timestamptz not null default now()
);

create index if not exists center_leads_status_idx on public.center_leads (status, created_at desc);

-- -----------------------------------------------------------------------------
-- Statistika: reklama beruvchi markazlarga ko'rsatiladigan harakatlar
-- -----------------------------------------------------------------------------
create table if not exists public.center_events (
  id          bigserial primary key,
  center_id   uuid not null references public.centers (id) on delete cascade,
  -- view | call | route | telegram | website
  event_type  text not null check (event_type in ('view', 'call', 'route', 'telegram', 'website')),
  created_at  timestamptz not null default now()
);

create index if not exists center_events_center_idx on public.center_events (center_id, created_at desc);

-- -----------------------------------------------------------------------------
-- updated_at ni avtomatik yangilash
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists centers_set_updated_at on public.centers;
create trigger centers_set_updated_at
  before update on public.centers
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
--
-- Ilova `anon` kaliti bilan ishlaydi, shuning uchun ruxsatlar qat'iy:
--   centers       — hamma faqat FAOL markazlarni O'QIYDI, yozish mumkin emas
--   center_leads  — hamma ariza QO'SHADI, lekin birovning arizasini o'qiy olmaydi
--   center_events — hamma statistika YOZADI, o'qish faqat panel orqali
-- Markazlarni qo'shish/tahrirlash Supabase paneli yoki service_role orqali.
-- -----------------------------------------------------------------------------
alter table public.centers       enable row level security;
alter table public.center_leads  enable row level security;
alter table public.center_events enable row level security;

drop policy if exists "Faol markazlarni hamma o'qiydi" on public.centers;
create policy "Faol markazlarni hamma o'qiydi"
  on public.centers for select
  using (is_active = true);

drop policy if exists "Ariza qoldirish hammaga ruxsat" on public.center_leads;
create policy "Ariza qoldirish hammaga ruxsat"
  on public.center_leads for insert
  with check (true);

drop policy if exists "Statistika yozish hammaga ruxsat" on public.center_events;
create policy "Statistika yozish hammaga ruxsat"
  on public.center_events for insert
  with check (
    -- Faqat mavjud va faol markaz uchun yozuv qabul qilinadi.
    exists (select 1 from public.centers c where c.id = center_id and c.is_active)
  );

-- -----------------------------------------------------------------------------
-- Markaz statistikasi (panel uchun qulay ko'rinish).
-- `security_invoker` — ko'rinish chaqiruvchining huquqlari bilan ishlaydi,
-- shuning uchun anon kalit bu yerdan ma'lumot olmaydi.
-- -----------------------------------------------------------------------------
create or replace view public.center_stats
with (security_invoker = true)
as
select
  c.id,
  c.name,
  c.tier,
  count(e.*) filter (where e.event_type = 'view')  as views,
  count(e.*) filter (where e.event_type = 'call')  as calls,
  count(e.*) filter (where e.event_type = 'route') as routes
from public.centers c
left join public.center_events e on e.center_id = c.id
group by c.id, c.name, c.tier;

-- -----------------------------------------------------------------------------
-- Rol huquqlari
--
-- Supabase'da `anon` (ilovaning ommaviy kaliti) va `authenticated` rollari
-- mavjud. Supabase yangi jadvallarga standart huquqlarni o'zi beradi, lekin
-- bunga tayanmasdan aniq yozib qo'yamiz — sxema boshqa muhitda ham bir xil
-- ishlashi uchun. Haqiqiy cheklov RLS siyosatlarida.
--
-- DO blok — bu rollar yo'q muhitda (masalan oddiy Postgres'da sinovda)
-- fayl xatosiz bajarilishi uchun.
-- -----------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    grant usage on schema public to anon;
    grant select on public.centers to anon;
    grant insert on public.center_leads to anon;
    grant insert on public.center_events to anon;
    -- center_events.id bigserial bo'lgani uchun ketma-ketlikka ham ruxsat kerak.
    grant usage, select on sequence public.center_events_id_seq to anon;
  end if;

  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    grant usage on schema public to authenticated;
    grant select on public.centers to authenticated;
    grant insert on public.center_leads to authenticated;
    grant insert on public.center_events to authenticated;
    grant usage, select on sequence public.center_events_id_seq to authenticated;
  end if;
end $$;
