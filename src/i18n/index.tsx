import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { ru } from './ru';
import { uz, type TranslationKey } from './uz';

export type Lang = 'uz' | 'ru';

const DICTS: Record<Lang, Record<TranslationKey, string>> = {
  uz: uz as unknown as Record<TranslationKey, string>,
  ru,
};

const STORAGE_KEY = 'logoplace.lang';

/** `{name}` ko'rinishidagi o'rinbosarlarni almashtiradi. */
function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  /** Tilga qarab o'zbekcha yoki ruscha maydonni tanlaydi. */
  pick: (uzValue: string | null | undefined, ruValue: string | null | undefined) => string;
  /** Til diskdan yuklanganini bildiradi. */
  ready: boolean;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('uz');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!cancelled && (stored === 'uz' || stored === 'ru')) setLangState(stored);
      })
      .catch(() => {
        // Saqlangan til o'qilmasa, standart 'uz' qoladi.
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      // Saqlab bo'lmasa ham tanlov shu sessiyada ishlaydi.
    });
  }, []);

  const value = useMemo<I18nValue>(() => {
    const dict = DICTS[lang];
    return {
      lang,
      setLang,
      ready,
      t: (key, vars) => interpolate(dict[key] ?? key, vars),
      pick: (uzValue, ruValue) =>
        (lang === 'ru' ? ruValue || uzValue : uzValue || ruValue) ?? '',
    };
  }, [lang, setLang, ready]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n faqat <I18nProvider> ichida ishlatiladi');
  return ctx;
}

export type { TranslationKey };
