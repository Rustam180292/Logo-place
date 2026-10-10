import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useScheme } from '@/hooks/use-theme';
import { I18nProvider, useI18n } from '@/i18n';
import { CentersProvider } from '@/lib/centers-store';
import { FavoritesProvider } from '@/lib/favorites';

/** Ekranlar stacki — sarlavhalar tarjimaga bog'liq, shuning uchun alohida komponent. */
function RootNavigator() {
  const scheme = useScheme();
  const { t } = useI18n();

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="center/[id]"
          options={{ title: '', headerBackButtonDisplayMode: 'minimal' }}
        />
        <Stack.Screen
          name="add-center"
          options={{ title: t('leadTitle'), presentation: 'modal' }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <I18nProvider>
      <FavoritesProvider>
        <CentersProvider>
          <RootNavigator />
        </CentersProvider>
      </FavoritesProvider>
    </I18nProvider>
  );
}
