import { FALLBACK_CENTERS } from '@/data/fallback-centers';
import type { Lang } from '@/i18n';
import type {
  AgeGroup,
  Center,
  CenterLead,
  CenterTier,
  CenterWithDistance,
  ServiceKey,
} from '@/types/center';

import { distanceKm, isOpenAt, type Coords } from './geo';
import { isSupabaseConfigured, supabase } from './supabase';

export interface CenterFilters {
  query: string;
  services: ServiceKey[];
  ageGroups: AgeGroup[];
  district: string | null;
  /** Eng yuqori narx chegarasi, so'mda. `null` — chegara yo'q. */
  maxPrice: number | null;
  onlyVerified: boolean;
  onlyOpen: boolean;
}

export type SortMode = 'distance' | 'rating' | 'price';

export const EMPTY_FILTERS: CenterFilters = {
  query: '',
  services: [],
  ageGroups: [],
  district: null,
  maxPrice: null,
  onlyVerified: false,
  onlyOpen: false,
};

/** Filtrlardan biri faolligini aniqlaydi (qidiruv matni hisobga olinmaydi). */
export function hasActiveFilters(filters: CenterFilters): boolean {
  return (
    filters.services.length > 0 ||
    filters.ageGroups.length > 0 ||
    filters.district !== null ||
    filters.maxPrice !== null ||
    filters.onlyVerified ||
    filters.onlyOpen
  );
}

/**
 * Markazlarni Supabase'dan oladi. Kalitlar sozlanmagan bo'lsa yoki so'rov
 * muvaffaqiyatsiz bo'lsa, demo ro'yxat qaytariladi — ilova hech qachon
 * bo'sh ekran ko'rsatmaydi.
 */
export async function fetchCenters(): Promise<{ centers: Center[]; isDemo: boolean }> {
  if (!isSupabaseConfigured || !supabase) {
    return { centers: FALLBACK_CENTERS, isDemo: true };
  }
  const { data, error } = await supabase
    .from('centers')
    .select('*')
    .eq('is_active', true)
    .order('tier', { ascending: false })
    .order('rating', { ascending: false, nullsFirst: false });

  if (error || !data) {
    return { centers: FALLBACK_CENTERS, isDemo: true };
  }
  return { centers: data as Center[], isDemo: false };
}

/** Bitta markazni id bo'yicha oladi. */
export async function fetchCenterById(id: string): Promise<Center | null> {
  if (!isSupabaseConfigured || !supabase) {
    return FALLBACK_CENTERS.find((c) => c.id === id) ?? null;
  }
  const { data, error } = await supabase.from('centers').select('*').eq('id', id).maybeSingle();
  if (error || !data) {
    return FALLBACK_CENTERS.find((c) => c.id === id) ?? null;
  }
  return data as Center;
}

/** Har bir markazga foydalanuvchidan masofani qo'shadi. */
export function withDistance(centers: Center[], from: Coords | null): CenterWithDistance[] {
  return centers.map((center) => ({
    ...center,
    distanceKm: from ? distanceKm(from, { lat: center.lat, lng: center.lng }) : null,
  }));
}

function matchesQuery(center: Center, query: string, lang: Lang): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    center.name,
    center.name_ru,
    center.address,
    center.address_ru,
    center.district,
    center.city,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  // Tilga qarab emas, barcha maydonlar bo'yicha qidiramiz: ota-ona nomni
  // ruscha yozib, interfeysni o'zbekchada ishlatishi mumkin.
  void lang;
  return haystack.includes(needle);
}

export function filterCenters(
  centers: CenterWithDistance[],
  filters: CenterFilters,
  lang: Lang,
  now = new Date(),
): CenterWithDistance[] {
  return centers.filter((center) => {
    if (!matchesQuery(center, filters.query, lang)) return false;
    if (filters.services.length && !filters.services.every((s) => center.services.includes(s))) {
      return false;
    }
    if (
      filters.ageGroups.length &&
      !filters.ageGroups.some((a) => center.age_groups.includes(a))
    ) {
      return false;
    }
    if (filters.district && center.district !== filters.district) return false;
    if (filters.maxPrice !== null) {
      // Narxi ko'rsatilmagan markazlar narx filtrida chiqmaydi.
      if (center.price_from === null || center.price_from > filters.maxPrice) return false;
    }
    if (filters.onlyVerified && !center.is_verified) return false;
    if (filters.onlyOpen && isOpenAt(center.working_hours, now) !== true) return false;
    return true;
  });
}

/**
 * Reklama darajasining tartibdagi vazni.
 *
 * Bu vazn FAQAT bir xil masofa guruhidagi (1 km) markazlar orasida
 * tenglikni buzish uchun ishlatiladi — to'lov masofani buzib ko'rsatmaydi.
 * Premium markazlar bundan tashqari ro'yxat boshida ochiq "Reklama" blokida
 * ko'rsatiladi.
 */
const TIER_WEIGHT: Record<CenterTier, number> = { premium: 2, standard: 1, free: 0 };

/** Masofani 1 km'li guruhlarga bo'ladi — tenglikni aniqlash uchun. */
function distanceBand(km: number | null): number {
  if (km === null) return Number.MAX_SAFE_INTEGER;
  return Math.floor(km);
}

export function sortCenters(
  centers: CenterWithDistance[],
  mode: SortMode,
): CenterWithDistance[] {
  const sorted = [...centers];
  sorted.sort((a, b) => {
    if (mode === 'rating') {
      const diff = (b.rating ?? -1) - (a.rating ?? -1);
      if (diff !== 0) return diff;
      return b.reviews_count - a.reviews_count;
    }
    if (mode === 'price') {
      const aPrice = a.price_from ?? Number.MAX_SAFE_INTEGER;
      const bPrice = b.price_from ?? Number.MAX_SAFE_INTEGER;
      if (aPrice !== bPrice) return aPrice - bPrice;
      return TIER_WEIGHT[b.tier] - TIER_WEIGHT[a.tier];
    }
    // mode === 'distance'
    const aBand = distanceBand(a.distanceKm);
    const bBand = distanceBand(b.distanceKm);
    if (aBand !== bBand) return aBand - bBand;
    const tierDiff = TIER_WEIGHT[b.tier] - TIER_WEIGHT[a.tier];
    if (tierDiff !== 0) return tierDiff;
    const aKm = a.distanceKm ?? Number.MAX_SAFE_INTEGER;
    const bKm = b.distanceKm ?? Number.MAX_SAFE_INTEGER;
    if (aKm !== bKm) return aKm - bKm;
    return (b.rating ?? -1) - (a.rating ?? -1);
  });
  return sorted;
}

/** Ro'yxat boshida ko'rsatiladigan reklama bloki uchun markazlar soni. */
const PROMOTED_LIMIT = 2;

/**
 * Premium markazlarni alohida ajratadi. Ular ro'yxatda ham qoladi —
 * blok faqat qo'shimcha, ochiq belgilangan reklama o'rni.
 */
export function splitPromoted(centers: CenterWithDistance[]): {
  promoted: CenterWithDistance[];
  regular: CenterWithDistance[];
} {
  const promoted = centers.filter((c) => c.tier === 'premium').slice(0, PROMOTED_LIMIT);
  return { promoted, regular: centers };
}

/** Markazlar ro'yxatidan mavjud tumanlar ro'yxatini tuzadi. */
export function collectDistricts(centers: Center[]): string[] {
  const set = new Set<string>();
  for (const center of centers) {
    if (center.district) set.add(center.district);
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'uz'));
}

export type CenterEventType = 'view' | 'call' | 'route' | 'telegram' | 'website';

/**
 * Markaz bilan bo'lgan harakatni qayd etadi — reklama beruvchi markazlarga
 * statistika ko'rsatish uchun. Xato bo'lsa jimgina tashlab ketiladi:
 * statistika ilovaning asosiy vazifasiga to'sqinlik qilmasligi kerak.
 */
export async function logCenterEvent(centerId: string, type: CenterEventType): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('center_events').insert({ center_id: centerId, event_type: type });
  } catch {
    // Statistika yozilmasa ham foydalanuvchi uchun hech narsa o'zgarmaydi.
  }
}

/** Markaz egasining arizasini yuboradi. */
export async function submitLead(lead: CenterLead): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured || !supabase) {
    // Kalit sozlanmagan — demo rejimda arizani yuborib bo'lmaydi.
    return { ok: false };
  }
  const { error } = await supabase.from('center_leads').insert(lead);
  return { ok: !error };
}
