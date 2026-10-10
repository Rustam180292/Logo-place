import { Linking, Platform, Share } from 'react-native';

import type { Center } from '@/types/center';

import { logCenterEvent } from './centers';

/**
 * Havolani ochadi. Birinchi variant ishlamasa (masalan, Yandex Navigator
 * o'rnatilmagan bo'lsa), navbatdagisiga o'tadi.
 */
async function openFirstAvailable(urls: string[]): Promise<boolean> {
  for (const url of urls) {
    try {
      // canOpenURL custom sxemalar uchun Android'da `queries` talab qiladi,
      // shuning uchun to'g'ridan-to'g'ri ochib, xatoni ushlaymiz.
      await Linking.openURL(url);
      return true;
    } catch {
      continue;
    }
  }
  return false;
}

/** Markazga qo'ng'iroq qiladi. */
export async function callCenter(center: Center, phone?: string): Promise<void> {
  const number = (phone ?? center.phone).replace(/[^\d+]/g, '');
  void logCenterEvent(center.id, 'call');
  // iOS'da `telprompt` tasdiqlash oynasini ko'rsatadi.
  await openFirstAvailable(
    Platform.OS === 'ios' ? [`telprompt:${number}`, `tel:${number}`] : [`tel:${number}`],
  );
}

/**
 * Markazgacha yo'nalishni ochadi: avval Yandex Navigator, so'ng Yandex Maps
 * ilovasi, oxirida brauzerdagi harita.
 */
export async function openRoute(center: Center): Promise<void> {
  const { lat, lng } = center;
  void logCenterEvent(center.id, 'route');
  await openFirstAvailable([
    `yandexnavi://build_route_on_map?lat_to=${lat}&lon_to=${lng}`,
    `yandexmaps://maps.yandex.ru/?rtext=~${lat},${lng}&rtt=auto`,
    `https://yandex.uz/maps/?rtext=~${lat}%2C${lng}&rtt=auto`,
  ]);
}

/** Telegram hisobini ochadi. */
export async function openTelegram(center: Center): Promise<void> {
  if (!center.telegram) return;
  const username = center.telegram.replace(/^@/, '');
  void logCenterEvent(center.id, 'telegram');
  await openFirstAvailable([`tg://resolve?domain=${username}`, `https://t.me/${username}`]);
}

/** Instagram profilini ochadi. */
export async function openInstagram(center: Center): Promise<void> {
  if (!center.instagram) return;
  const username = center.instagram.replace(/^@/, '');
  await openFirstAvailable([
    `instagram://user?username=${username}`,
    `https://instagram.com/${username}`,
  ]);
}

/** Markaz veb-saytini ochadi. */
export async function openWebsite(center: Center): Promise<void> {
  if (!center.website) return;
  const url = /^https?:\/\//i.test(center.website) ? center.website : `https://${center.website}`;
  void logCenterEvent(center.id, 'website');
  await openFirstAvailable([url]);
}

/** Markaz ma'lumotini boshqa ilovalar orqali ulashadi. */
export async function shareCenter(center: Center, appName: string): Promise<void> {
  const lines = [
    center.name,
    center.address,
    center.phone,
    `— ${appName}`,
  ].filter(Boolean);
  try {
    await Share.share({ message: lines.join('\n'), title: center.name });
  } catch {
    // Foydalanuvchi ulashishni bekor qilgan bo'lishi mumkin.
  }
}
