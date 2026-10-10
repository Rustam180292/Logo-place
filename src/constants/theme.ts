/**
 * Logoped Topish — dizayn tokenlari.
 *
 * Palitra ota-onalarga ishonch beradigan, tibbiy-ta'limiy ohangda tanlangan:
 * asosiy rang — tinch ko'k-turkuz, urg'u — iliq apelsin (reklama/premium uchun).
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0B1F33',
    textSecondary: '#5A6B7D',
    textMuted: '#8795A4',
    background: '#FFFFFF',
    backgroundAlt: '#F4F7FA',
    card: '#FFFFFF',
    border: '#E2E8EF',
    primary: '#0E7C86',
    primarySoft: '#E6F4F5',
    accent: '#E8833A',
    accentSoft: '#FDF0E6',
    success: '#2E8B57',
    danger: '#C0392B',
    star: '#F2B13C',
    overlay: 'rgba(11, 31, 51, 0.45)',
  },
  dark: {
    text: '#F2F6FA',
    textSecondary: '#A9B6C4',
    textMuted: '#7C8A98',
    background: '#0C1116',
    backgroundAlt: '#141B22',
    card: '#161E26',
    border: '#242F3A',
    primary: '#3FB3BD',
    primarySoft: '#13282B',
    accent: '#F09A58',
    accentSoft: '#2C1E13',
    success: '#4FAE78',
    danger: '#E06B5E',
    star: '#F2B13C',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', rounded: 'normal', mono: 'monospace' },
  web: { sans: 'system-ui, sans-serif', rounded: 'system-ui, sans-serif', mono: 'monospace' },
})!;

/** 4px bazasidagi masofa shkalasi. */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
} as const;

export const FontSize = {
  caption: 12,
  small: 13,
  body: 15,
  title: 17,
  heading: 22,
  display: 28,
} as const;

export const MaxContentWidth = 720;
