import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/ActionButton';
import { Chip } from '@/components/ui/Chip';
import { AGE_GROUPS, PRICE_STEPS, SERVICE_KEYS } from '@/constants/catalog';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { EMPTY_FILTERS, type CenterFilters, type SortMode } from '@/lib/centers';
import { formatPrice } from '@/lib/geo';

const SORT_MODES: { mode: SortMode; labelKey: 'sortDistance' | 'sortRating' | 'sortPrice' }[] = [
  { mode: 'distance', labelKey: 'sortDistance' },
  { mode: 'rating', labelKey: 'sortRating' },
  { mode: 'price', labelKey: 'sortPrice' },
];

export interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: CenterFilters;
  sortMode: SortMode;
  districts: string[];
  onApply: (filters: CenterFilters, sortMode: SortMode) => void;
}

/** Faqat bir elementni qo'shib/olib tashlaydigan yordamchi. */
function toggleIn<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}

export function FilterSheet({
  visible,
  onClose,
  filters,
  sortMode,
  districts,
  onApply,
}: FilterSheetProps) {
  const theme = useTheme();
  const { t } = useI18n();

  // Qoralama holat: foydalanuvchi "Qo'llash"ni bosmaguncha ro'yxat o'zgarmaydi.
  const [draft, setDraft] = useState<CenterFilters>(filters);
  const [draftSort, setDraftSort] = useState<SortMode>(sortMode);

  useEffect(() => {
    if (visible) {
      setDraft(filters);
      setDraftSort(sortMode);
    }
  }, [visible, filters, sortMode]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={[styles.backdrop, { backgroundColor: theme.overlay }]}>
        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <ThemedText variant="heading">{t('filters')}</ThemedText>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t('close')}
            >
              <Ionicons name="close" size={24} color={theme.textMuted} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Section title={t('filterSort')}>
              {SORT_MODES.map(({ mode, labelKey }) => (
                <Chip
                  key={mode}
                  label={t(labelKey)}
                  selected={draftSort === mode}
                  onPress={() => setDraftSort(mode)}
                />
              ))}
            </Section>

            <Section title={t('filterService')}>
              {SERVICE_KEYS.map((service) => (
                <Chip
                  key={service}
                  label={t(`service.${service}`)}
                  selected={draft.services.includes(service)}
                  onPress={() =>
                    setDraft((current) => ({
                      ...current,
                      services: toggleIn(current.services, service),
                    }))
                  }
                />
              ))}
            </Section>

            <Section title={t('filterAge')}>
              {AGE_GROUPS.map((age) => (
                <Chip
                  key={age}
                  label={t(`age.${age}`)}
                  selected={draft.ageGroups.includes(age)}
                  onPress={() =>
                    setDraft((current) => ({
                      ...current,
                      ageGroups: toggleIn(current.ageGroups, age),
                    }))
                  }
                />
              ))}
            </Section>

            {districts.length > 0 ? (
              <Section title={t('filterDistrict')}>
                <Chip
                  label={t('all')}
                  selected={draft.district === null}
                  onPress={() => setDraft((current) => ({ ...current, district: null }))}
                />
                {districts.map((district) => (
                  <Chip
                    key={district}
                    label={district}
                    selected={draft.district === district}
                    onPress={() =>
                      setDraft((current) => ({
                        ...current,
                        district: current.district === district ? null : district,
                      }))
                    }
                  />
                ))}
              </Section>
            ) : null}

            <Section title={t('filterPrice')}>
              <Chip
                label={t('all')}
                selected={draft.maxPrice === null}
                onPress={() => setDraft((current) => ({ ...current, maxPrice: null }))}
              />
              {PRICE_STEPS.map((price) => (
                <Chip
                  key={price}
                  label={`≤ ${formatPrice(price)}`}
                  selected={draft.maxPrice === price}
                  onPress={() =>
                    setDraft((current) => ({
                      ...current,
                      maxPrice: current.maxPrice === price ? null : price,
                    }))
                  }
                />
              ))}
            </Section>

            <ToggleRow
              label={t('filterOnlyVerified')}
              value={draft.onlyVerified}
              onChange={(value) => setDraft((current) => ({ ...current, onlyVerified: value }))}
            />
            <ToggleRow
              label={t('filterOnlyOpen')}
              value={draft.onlyOpen}
              onChange={(value) => setDraft((current) => ({ ...current, onlyOpen: value }))}
            />
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <ActionButton
              label={t('clear')}
              variant="secondary"
              onPress={() => {
                setDraft({ ...EMPTY_FILTERS, query: draft.query });
                setDraftSort('distance');
              }}
              style={styles.footerButton}
            />
            <ActionButton
              label={t('apply')}
              onPress={() => onApply(draft, draftSort)}
              style={styles.footerButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText variant="small" weight="600" themeColor="textSecondary">
        {title}
      </ThemedText>
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.toggleRow, { borderColor: theme.border }]}>
      <ThemedText variant="body" style={styles.flex}>
        {label}
      </ThemedText>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: theme.primary, false: theme.border }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '88%',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: { padding: Spacing.lg, gap: Spacing.xl, paddingBottom: Spacing.xxl },
  section: { gap: Spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  flex: { flex: 1 },
  footer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerButton: { flex: 1 },
});
