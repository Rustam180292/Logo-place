import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';

import { DEFAULT_CENTER, type Coords } from '@/lib/geo';
import type { CenterWithDistance } from '@/types/center';

import { buildMapHtml, type MapMarkerInput, type MapMessage } from './mapHtml';

const API_KEY = process.env.EXPO_PUBLIC_YANDEX_MAPS_API_KEY?.trim() ?? '';

/**
 * Harita yorliqlari tili. Yandex JS API 3.0 cheklangan tillar to'plamini
 * qo'llab-quvvatlaydi, shuning uchun standart qiymat `ru_RU` — O'zbekiston
 * uchun eng to'liq qamrov. .env orqali almashtirish mumkin.
 */
const MAP_LANG = process.env.EXPO_PUBLIC_YANDEX_MAPS_LANG?.trim() || 'ru_RU';

/** Harita API kaliti sozlanganini bildiradi. */
export const isMapConfigured = API_KEY.length > 0;

const INITIAL_ZOOM = 12;
const FOCUS_ZOOM = 15;

export interface CentersMapProps {
  centers: CenterWithDistance[];
  userLocation: Coords | null;
  selectedId: string | null;
  onSelectCenter: (id: string | null) => void;
  theme: 'light' | 'dark';
  /** Harita tayyor bo'lganda bir marta chaqiriladi. */
  onReady?: () => void;
}

/**
 * Markazlarni haritada ko'rsatadi.
 *
 * Tashqi interfeys harita qanday amalga oshirilganiga bog'liq emas — hozir
 * Yandex JS API WebView ichida, keyinchalik native MapKit bo'lishi mumkin.
 */
export function CentersMap({
  centers,
  userLocation,
  selectedId,
  onSelectCenter,
  theme,
  onReady,
}: CentersMapProps) {
  const webRef = useRef<WebView>(null);
  const [isReady, setIsReady] = useState(false);
  /** Foydalanuvchi joylashuviga bir marta avtomatik markazlashtirish uchun. */
  const didCenterOnUser = useRef(false);

  // HTML faqat mavzu/til o'zgarganda qayta quriladi — markazlar o'zgarganda
  // qayta qurilsa, harita to'liq qaytadan yuklanib, ko'rish joyi yo'qoladi.
  const html = useMemo(
    () =>
      buildMapHtml({
        apiKey: API_KEY,
        mapLang: MAP_LANG,
        theme,
        initialCenter: userLocation ?? DEFAULT_CENTER,
        initialZoom: INITIAL_ZOOM,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- userLocation ataylab chiqarilgan
    [theme],
  );

  const inject = useCallback((script: string) => {
    webRef.current?.injectJavaScript(`${script}; true;`);
  }, []);

  const markers = useMemo<MapMarkerInput[]>(
    () =>
      centers.map((center) => ({
        id: center.id,
        lat: center.lat,
        lng: center.lng,
        tier: center.tier,
      })),
    [centers],
  );

  useEffect(() => {
    if (!isReady) return;
    inject(`window.LP.setCenters(${JSON.stringify(markers)})`);
  }, [isReady, markers, inject]);

  useEffect(() => {
    if (!isReady) return;
    inject(`window.LP.setSelected(${JSON.stringify(selectedId)})`);
  }, [isReady, selectedId, inject]);

  useEffect(() => {
    if (!isReady) return;
    inject(`window.LP.setUser(${JSON.stringify(userLocation)})`);
    if (userLocation && !didCenterOnUser.current) {
      didCenterOnUser.current = true;
      inject(`window.LP.moveTo(${JSON.stringify(userLocation)}, ${INITIAL_ZOOM})`);
    }
  }, [isReady, userLocation, inject]);

  // Tanlangan markazga haritani suradi, shunda kartochka ostida qolmaydi.
  useEffect(() => {
    if (!isReady || !selectedId) return;
    const target = centers.find((c) => c.id === selectedId);
    if (!target) return;
    inject(
      `window.LP.moveTo(${JSON.stringify({ lat: target.lat, lng: target.lng })}, ${FOCUS_ZOOM})`,
    );
  }, [isReady, selectedId, centers, inject]);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      let message: MapMessage;
      try {
        message = JSON.parse(event.nativeEvent.data) as MapMessage;
      } catch {
        return;
      }
      switch (message.type) {
        case 'ready':
          setIsReady(true);
          onReady?.();
          break;
        case 'select':
          onSelectCenter(message.id);
          break;
        case 'deselect':
          onSelectCenter(null);
          break;
        case 'error':
          // Harita o'zi sahifada xato matnini ko'rsatadi.
          break;
      }
    },
    [onSelectCenter, onReady],
  );

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html, baseUrl: 'https://localhost' }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        // Harita o'zi sahifa ichida suriladi.
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        androidLayerType="hardware"
        setSupportMultipleWindows={false}
        style={styles.web}
        // Fon haritaga mos — yuklanish paytida oq miltillash bo'lmasin.
        containerStyle={{ backgroundColor: theme === 'dark' ? '#0C1116' : '#F4F7FA' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  web: { flex: 1, backgroundColor: 'transparent' },
});
