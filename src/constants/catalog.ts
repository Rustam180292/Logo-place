import type { AgeGroup, ServiceKey } from '@/types/center';

/** Filtrlarda ko'rsatiladigan xizmatlar — tartib ota-onalar uchun eng keng tarqalganidan boshlanadi. */
export const SERVICE_KEYS: ServiceKey[] = [
  'speech_delay',
  'dyslalia',
  'stuttering',
  'dysarthria',
  'alalia',
  'dyslexia',
  'rhinolalia',
  'autism',
  'logomassage',
  'defectologist',
  'psychologist',
  'group_lessons',
  'home_visit',
  'online',
];

export const AGE_GROUPS: AgeGroup[] = ['0_3', '3_5', '5_7', '7_12', '12_plus'];

/** Narx filtri uchun tayyor chegaralar, so'mda. */
export const PRICE_STEPS: number[] = [60000, 80000, 100000, 150000];
