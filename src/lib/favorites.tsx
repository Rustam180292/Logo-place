import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { loadFavorites, saveFavorites } from './storage';

interface FavoritesValue {
  ids: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
  /** Ro'yxat diskdan yuklanganini bildiradi. */
  ready: boolean;
}

const FavoritesContext = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadFavorites()
      .then((stored) => {
        if (!cancelled) setIds(stored);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [id, ...current];
      // Diskka yozish fon rejimida — interfeys darhol javob beradi.
      void saveFavorites(next);
      return next;
    });
  }, []);

  const value = useMemo<FavoritesValue>(
    () => ({ ids, ready, isFavorite: (id) => ids.includes(id), toggle }),
    [ids, ready, toggle],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites faqat <FavoritesProvider> ichida ishlatiladi');
  return ctx;
}
