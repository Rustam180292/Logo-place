import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();

/**
 * Supabase kalitlari sozlangani — `false` bo'lsa ilova to'liq ishlashda davom etadi,
 * lekin markazlarni `src/data/fallback-centers.ts` dagi demo ro'yxatdan oladi.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        storage: AsyncStorage,
        persistSession: true,
        autoRefreshToken: true,
        // Mobil ilovada URL orqali sessiya qaytmaydi.
        detectSessionInUrl: false,
      },
    })
  : null;
