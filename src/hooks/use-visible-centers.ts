import { useMemo } from 'react';

import { useI18n } from '@/i18n';
import { filterCenters, sortCenters, withDistance } from '@/lib/centers';
import { useCenters } from '@/lib/centers-store';
import type { CenterWithDistance } from '@/types/center';

/**
 * Do'kondagi markazlarga masofa qo'shib, joriy filtr va tartibni qo'llaydi.
 * Harita va ro'yxat ekranlari bir xil natijani ko'rsatishi uchun yagona joy.
 */
export function useVisibleCenters(): CenterWithDistance[] {
  const { centers, userLocation, filters, sortMode } = useCenters();
  const { lang } = useI18n();

  return useMemo(() => {
    const measured = withDistance(centers, userLocation);
    const filtered = filterCenters(measured, filters, lang);
    return sortCenters(filtered, sortMode);
  }, [centers, userLocation, filters, sortMode, lang]);
}
