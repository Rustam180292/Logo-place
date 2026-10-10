import { useColorScheme } from '@/hooks/use-color-scheme';

import { Colors } from '@/constants/theme';

export type Scheme = 'light' | 'dark';

/** Tizim mavzusini `light` yoki `dark` ga keltiradi. */
export function useScheme(): Scheme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}

/** Joriy mavzuning rang palitrasi. */
export function useTheme() {
  return Colors[useScheme()];
}
