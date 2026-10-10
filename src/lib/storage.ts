import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'logoplace.favorites';

/** Saqlangan markazlar ro'yxatini diskdan o'qiydi. */
export async function loadFavorites(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    // Buzilgan yoki eski formatdagi yozuvni jimgina tashlab ketamiz.
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

/** Saqlangan markazlar ro'yxatini diskka yozadi. */
export async function saveFavorites(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    // Diskka yozilmasa, ro'yxat shu sessiyada xotirada ishlaydi.
  }
}
