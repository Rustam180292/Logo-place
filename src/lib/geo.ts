import type { WeekDay, WorkingHours } from '@/types/center';

export interface Coords {
  lat: number;
  lng: number;
}

/** Joylashuv aniqlanmaganda haritaning boshlang'ich nuqtasi — Toshkent markazi. */
export const DEFAULT_CENTER: Coords = { lat: 41.3111, lng: 69.2797 };

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Ikki nuqta orasidagi masofa (haversine), kilometrda. */
export function distanceKm(a: Coords, b: Coords): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Masofani foydalanuvchiga ko'rsatish uchun formatlaydi: "850 m" yoki "3,2 km". */
export function formatDistance(km: number | null, kmLabel: string): string {
  if (km === null || Number.isNaN(km)) return '';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1).replace('.', ',')} ${kmLabel}`;
  return `${Math.round(km)} ${kmLabel}`;
}

/** Narxni mingliklar bo'yicha ajratib ko'rsatadi: 150000 -> "150 000". */
export function formatPrice(value: number): string {
  return value.toLocaleString('ru-RU').replace(/ /g, ' ');
}

const WEEK_DAYS: WeekDay[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/** `Date.getDay()` natijasini hafta kuni kalitiga aylantiradi. */
export function weekDayKey(date: Date): WeekDay {
  return WEEK_DAYS[date.getDay()];
}

/** "09:30" ko'rinishidagi vaqtni yarim tundan boshlab daqiqaga aylantiradi. */
function minutesOfDay(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/**
 * Markaz berilgan paytda ishlayotganini aniqlaydi.
 * Ish vaqti ma'lum bo'lmasa `null` qaytaradi — "noma'lum" holati.
 */
export function isOpenAt(hours: WorkingHours | null, now = new Date()): boolean | null {
  if (!hours) return null;
  const today = hours[weekDayKey(now)];
  if (today === undefined) return null;
  if (today === null) return false;
  const open = minutesOfDay(today.open);
  const close = minutesOfDay(today.close);
  if (open === null || close === null) return null;
  const current = now.getHours() * 60 + now.getMinutes();
  // Yarim tundan oshadigan smena (masalan 20:00–02:00) ham qo'llab-quvvatlanadi.
  return close > open ? current >= open && current < close : current >= open || current < close;
}
