import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  /** Filtr tugmasi; berilmasa tugma ko'rsatilmaydi. */
  onPressFilters?: () => void;
  /** Faol filtrlar borligini bildiradi — tugmada nuqta chiqadi. */
  filtersActive?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onPressFilters,
  filtersActive = false,
}: SearchBarProps) {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <View style={styles.row}>
      <View style={[styles.field, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Ionicons name="search" size={18} color={theme.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={t('searchPlaceholder')}
          placeholderTextColor={theme.textMuted}
          style={[styles.input, { color: theme.text }]}
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        {value.length > 0 ? (
          <Pressable
            onPress={() => onChangeText('')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t('clear')}
          >
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {onPressFilters ? (
        <Pressable
          onPress={onPressFilters}
          accessibilityRole="button"
          accessibilityLabel={t('filters')}
          style={[styles.filterButton, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <Ionicons name="options-outline" size={20} color={theme.text} />
          {filtersActive ? (
            <View style={[styles.activeDot, { backgroundColor: theme.accent }]} />
          ) : null}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  input: { flex: 1, fontSize: 15, padding: 0 },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
