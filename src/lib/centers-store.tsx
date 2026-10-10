import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { Center } from '@/types/center';

import {
  collectDistricts,
  EMPTY_FILTERS,
  fetchCenters,
  type CenterFilters,
  type SortMode,
} from './centers';
import type { Coords } from './geo';
import { getCachedLocation, requestLocation, type LocationStatus } from './location';

interface CentersValue {
  centers: Center[];
  /** Ma'lumot demo ro'yxatdan olinganini bildiradi (Supabase sozlanmagan). */
  isDemo: boolean;
  loading: boolean;
  reload: () => void;

  userLocation: Coords | null;
  locationStatus: LocationStatus;
  /** Joylashuvga ruxsat so'raydi (foydalanuvchi tugmani bosganda). */
  askLocation: () => void;

  filters: CenterFilters;
  setFilters: (next: CenterFilters) => void;
  resetFilters: () => void;
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;

  /** Filtr uchun mavjud tumanlar. */
  districts: string[];
}

const CentersContext = createContext<CentersValue | null>(null);

/**
 * Markazlar, joylashuv va filtrlarni bitta joyda saqlaydi — harita va ro'yxat
 * ekranlari bir xil ma'lumot va filtrlar ustida ishlaydi, so'rov esa bir marta
 * bajariladi.
 */
export function CentersProvider({ children }: { children: React.ReactNode }) {
  const [centers, setCenters] = useState<Center[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  const [userLocation, setUserLocation] = useState<Coords | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');

  const [filters, setFilters] = useState<CenterFilters>(EMPTY_FILTERS);
  const [sortMode, setSortMode] = useState<SortMode>('distance');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCenters()
      .then((result) => {
        if (cancelled) return;
        setCenters(result.centers);
        setIsDemo(result.isDemo);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  // Ilova ochilganda avval mavjud ruxsatni tekshiramiz — tizim oynasi
  // foydalanuvchini darhol bezovta qilmasin.
  useEffect(() => {
    let cancelled = false;
    setLocationStatus('loading');
    getCachedLocation().then((result) => {
      if (cancelled) return;
      setLocationStatus(result.status);
      if (result.coords) setUserLocation(result.coords);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const askLocation = useCallback(() => {
    setLocationStatus('loading');
    void requestLocation().then((result) => {
      setLocationStatus(result.status);
      if (result.coords) setUserLocation(result.coords);
    });
  }, []);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);
  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const districts = useMemo(() => collectDistricts(centers), [centers]);

  const value = useMemo<CentersValue>(
    () => ({
      centers,
      isDemo,
      loading,
      reload,
      userLocation,
      locationStatus,
      askLocation,
      filters,
      setFilters,
      resetFilters,
      sortMode,
      setSortMode,
      districts,
    }),
    [
      centers,
      isDemo,
      loading,
      reload,
      userLocation,
      locationStatus,
      askLocation,
      filters,
      resetFilters,
      sortMode,
      districts,
    ],
  );

  return <CentersContext.Provider value={value}>{children}</CentersContext.Provider>;
}

export function useCenters(): CentersValue {
  const ctx = useContext(CentersContext);
  if (!ctx) throw new Error('useCenters faqat <CentersProvider> ichida ishlatiladi');
  return ctx;
}
