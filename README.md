# Logoped Topish

Ota-onalar uyiga yaqin **logopedik markazlarni haritada** topishi uchun mobil
ilova. Markazlar ilovaga reklama/joylashtirish asosida jalb qilinadi.

- **Platforma:** Expo (React Native) — iOS va Android
- **Harita:** Yandex Maps JS API 3.0 (WebView ichida, alohida modulga ajratilgan)
- **Ma'lumot:** Supabase (Postgres + RLS)
- **Tillar:** o'zbekcha va ruscha

---

## Tez boshlash

```bash
npm install
cp .env.example .env     # kalitlarni to'ldirish (ixtiyoriy, pastga qarang)
npx expo start
```

So'ng telefonda **Expo Go** ilovasini ochib, terminaldagi QR kodni skaner qiling.

> Kalitlarsiz ham ilova to'liq ishlaydi: markazlar `src/data/fallback-centers.ts`
> dagi **demo ro'yxatdan** olinadi, "Harita" bo'limida esa kalit kerakligi
> haqida tushuntirish chiqadi. Shunda interfeysni darhol ko'rish mumkin.

---

## Kalitlarni sozlash

### 1. Yandex Maps (harita uchun)

1. <https://developer.tech.yandex.ru/services> — ro'yxatdan o'tib, **JavaScript API va Geocoder** uchun kalit oling.
2. Kalitni `.env` ga yozing:

```
EXPO_PUBLIC_YANDEX_MAPS_API_KEY=sizning_kalitingiz
```

### 2. Supabase (markazlar bazasi uchun)

1. <https://supabase.com> da bepul loyiha yarating.
2. **SQL Editor** da `supabase/schema.sql` ni to'liq bajarting.
3. Interfeysni sinash uchun `supabase/seed.sql` ni ham bajarting (demo markazlar).
4. **Project Settings → API** dan URL va `anon` kalitni olib `.env` ga yozing:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

`.env` o'zgarishi kuchga kirishi uchun Expo serverini qaytadan ishga tushiring.

---

## Loyiha tuzilishi

```
src/
├── app/                        expo-router yo'nalishlari (fayl = ekran)
│   ├── _layout.tsx             providerlar: til, saqlanganlar, markazlar
│   ├── (tabs)/
│   │   ├── index.tsx           Harita
│   │   ├── list.tsx            Ro'yxat, qidiruv va filtrlar
│   │   ├── saved.tsx           Saqlangan markazlar
│   │   └── settings.tsx        Til, ma'lumot manbasi, markaz egalariga
│   ├── center/[id].tsx         Markaz batafsil sahifasi
│   └── add-center.tsx          Markaz egasining arizasi (modal)
├── components/
│   ├── map/                    HARITA MODULI — almashtirish uchun ajratilgan
│   │   ├── CentersMap.tsx      tashqi interfeys (haritadan mustaqil)
│   │   └── mapHtml.ts          WebView ichidagi Yandex JS API sahifasi
│   ├── CenterCard.tsx          ro'yxatdagi kartochka
│   ├── CenterPreview.tsx       haritada belgi bosilganda chiqadigan kartochka
│   ├── FilterSheet.tsx         filtrlar oynasi
│   ├── SearchBar.tsx
│   └── ui/                     Badge, Chip, ActionButton, Rating, Notice…
├── lib/
│   ├── centers.ts              ma'lumot olish, filtr, tartib, statistika
│   ├── centers-store.tsx       umumiy holat (markazlar + joylashuv + filtrlar)
│   ├── supabase.ts             klient; kalit bo'lmasa `null`
│   ├── actions.ts              qo'ng'iroq, yo'nalish, Telegram, ulashish
│   ├── favorites.tsx           saqlangan markazlar
│   ├── geo.ts                  masofa, narx formati, ish vaqti
│   ├── location.ts             GPS ruxsati
│   └── storage.ts              AsyncStorage
├── i18n/                       uz.ts / ru.ts va provider
├── constants/                  dizayn tokenlari va xizmatlar katalogi
├── types/center.ts             ma'lumot modeli
└── data/fallback-centers.ts    DEMO markazlar (o'ylab topilgan)

supabase/
├── schema.sql                  jadvallar, indekslar, RLS siyosatlari
└── seed.sql                    demo markazlar (fallback-centers.ts dan)
```

---

## Reklama modeli qanday ishlaydi

Har bir markazning `tier` maydoni bor — bu pulli joylashtirishning asosi:

| Daraja | Haritada | Ro'yxatda |
| --- | --- | --- |
| `free` | oddiy belgi | faqat masofa bo'yicha |
| `standard` | kattaroq belgi | "Tekshirilgan" nishoni, o'z masofa guruhida yuqorida |
| `premium` | eng katta, apelsin rangli, yulduzcha bilan | yuqoridagi **"Reklama"** blokida ham ko'rinadi |

Muhim qarorlar:

- **Reklama ochiq belgilanadi.** Pulli blok "Reklama" deb yoziladi va ostida
  "To'lov asosida joylashtirilgan" izohi turadi. Ota-ona nima pulli, nima
  organik ekanini ko'radi.
- **To'lov masofani buzmaydi.** Tartiblashda markazlar avval 1 km'li masofa
  guruhlariga bo'linadi; `tier` faqat **bir xil guruh ichidagi** tenglikni
  buzadi. Ya'ni uzoqdagi premium markaz yaqindagi bepulidan yuqoriga chiqmaydi
  (`src/lib/centers.ts`, `TIER_WEIGHT`).
- **Statistika** `center_events` jadvalida yig'iladi (ko'rish, qo'ng'iroq,
  yo'nalish) — reklama beruvchi markazga natijani ko'rsatish uchun.
  `center_stats` ko'rinishi buni markazlar bo'yicha jamlaydi.
- **Arizalar** `center_leads` jadvaliga tushadi: markaz egasi ilovadagi
  "Markazingizni qo'shish" formasini to'ldiradi.

---

## Haritani native SDK'ga o'tkazish

Hozir harita WebView ichida Yandex JS API orqali ishlaydi — Expo Go'da darhol
ishga tushadi va native build talab qilmaydi. Agar keyinchalik aniqroq
ishlaydigan native **Yandex MapKit** kerak bo'lsa, faqat
`src/components/map/` papkasini almashtirish kifoya: qolgan kod
`CentersMap` komponentining tashqi interfeysiga tayanadi
(`centers`, `userLocation`, `selectedId`, `onSelectCenter`, `theme`).

Native MapKit uchun `expo prebuild` va EAS Build kerak bo'ladi.

---

## Keyingi qadamlar

Hozir yo'q, lekin mantiqiy davomi bo'ladigan narsalar:

- Markaz rasmlari (`photos` maydoni bor, lekin interfeysda hali ko'rsatilmaydi)
- Ota-onalar sharhlari va reyting qo'yish
- Markaz egalari uchun o'z kabineti (statistikani ko'rish, ma'lumotni tahrirlash)
- Haritada ko'p markaz bo'lganda klasterlash (`@yandex/ymaps3-clusterer`)
- Push-xabarnomalar (yangi markaz ochilganda yoki chegirma bo'lganda)
