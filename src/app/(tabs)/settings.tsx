import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Chip } from '@/components/ui/Chip';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { useCenters } from '@/lib/centers-store';

export default function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t, lang, setLang } = useI18n();
  const { isDemo } = useCenters();

  return (
    <ThemedView style={styles.flex}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xxl }]}
      >
        <Section title={t('settingsLanguage')}>
          <View style={styles.chips}>
            <Chip
              label={t('settingsLangUz')}
              selected={lang === 'uz'}
              onPress={() => setLang('uz')}
            />
            <Chip
              label={t('settingsLangRu')}
              selected={lang === 'ru'}
              onPress={() => setLang('ru')}
            />
          </View>
        </Section>

        <Section title={t('settingsData')}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons
              name={isDemo ? 'flask-outline' : 'cloud-done-outline'}
              size={20}
              color={isDemo ? theme.accent : theme.success}
            />
            <ThemedText variant="body" style={styles.flex}>
              {isDemo ? t('settingsDataDemo') : t('settingsDataLive')}
            </ThemedText>
          </View>
        </Section>

        <Section title={t('settingsForOwners')}>
          <Pressable
            onPress={() => router.push('/add-center')}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Ionicons name="business-outline" size={20} color={theme.primary} />
            <ThemedText variant="body" style={styles.flex}>
              {t('settingsAddCenter')}
            </ThemedText>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </Pressable>
        </Section>

        <Section title={t('settingsAbout')}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.flex}>
              <ThemedText variant="body" weight="600">
                {t('appName')}
              </ThemedText>
              <ThemedText variant="small" themeColor="textSecondary">
                {t('appTagline')}
              </ThemedText>
            </View>
          </View>
          <ThemedText variant="caption" themeColor="textMuted">
            {t('settingsVersion')}: {Constants.expoConfig?.version ?? '1.0.0'}
          </ThemedText>
        </Section>
      </ScrollView>
    </ThemedView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText variant="small" weight="600" themeColor="textSecondary">
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.lg, gap: Spacing.xl },
  section: { gap: Spacing.sm },
  chips: { flexDirection: 'row', gap: Spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.lg,
  },
});
