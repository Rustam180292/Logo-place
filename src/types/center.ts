/** Logopedik markaz ma'lumot modeli (Supabase `centers` jadvaliga mos). */

/**
 * Markazning ilovadagi ko'rinish darajasi — reklama modelining asosi.
 * `premium`  — haritada kattaroq belgi, ro'yxatda "Reklama" blokida birinchi
 * `standard` — nishon (badge) va o'z masofa guruhida yuqoriga ko'tarilish
 * `free`     — oddiy ko'rinish, faqat masofa bo'yicha
 */
export type CenterTier = 'free' | 'standard' | 'premium';

/** Markaz ko'rsatadigan xizmat turlari. Kalitlar i18n orqali tarjima qilinadi. */
export type ServiceKey =
  | 'speech_delay'
  | 'dyslalia'
  | 'dysarthria'
  | 'alalia'
  | 'stuttering'
  | 'dyslexia'
  | 'rhinolalia'
  | 'autism'
  | 'logomassage'
  | 'defectologist'
  | 'psychologist'
  | 'group_lessons'
  | 'home_visit'
  | 'online';

/** Qabul qilinadigan yosh guruhlari. */
export type AgeGroup = '0_3' | '3_5' | '5_7' | '7_12' | '12_plus';

export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

/** Kun bo'yicha ish vaqti; `null` — dam olish kuni. */
export type WorkingHours = Partial<Record<WeekDay, { open: string; close: string } | null>>;

export interface Center {
  id: string;
  /** Nom — o'zbekcha (asosiy). */
  name: string;
  /** Nom — ruscha; bo'lmasa `name` ishlatiladi. */
  name_ru: string | null;
  description: string | null;
  description_ru: string | null;
  address: string;
  address_ru: string | null;
  city: string;
  /** Tuman — filtr uchun. */
  district: string | null;
  lat: number;
  lng: number;
  phone: string;
  phone_alt: string | null;
  /** Telegram foydalanuvchi nomi, `@` belgisiz. */
  telegram: string | null;
  instagram: string | null;
  website: string | null;
  services: ServiceKey[];
  age_groups: AgeGroup[];
  /** Bitta mashg'ulotning eng past narxi, so'mda. */
  price_from: number | null;
  price_note: string | null;
  price_note_ru: string | null;
  working_hours: WorkingHours | null;
  rating: number | null;
  reviews_count: number;
  photos: string[];
  tier: CenterTier;
  /** Markaz hujjatlari tekshirilgan. */
  is_verified: boolean;
  is_active: boolean;
}

/** Masofa hisoblangan markaz — ro'yxat va haritada ishlatiladi. */
export interface CenterWithDistance extends Center {
  /** Foydalanuvchidan masofa, kilometrda. Joylashuv yo'q bo'lsa `null`. */
  distanceKm: number | null;
}

/** Markaz egasi yuboradigan ariza (reklama/joylashtirish uchun). */
export interface CenterLead {
  center_name: string;
  contact_name: string;
  phone: string;
  city: string;
  note: string | null;
}
