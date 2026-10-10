import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

export interface RatingProps {
  value: number | null;
  reviewsCount: number;
  /** Sharhlar sonini yashiradi — kartochkada joy tor bo'lganda. */
  compact?: boolean;
}

export function Rating({ value, reviewsCount, compact = false }: RatingProps) {
  const theme = useTheme();
  const { t } = useI18n();

  if (value === null) {
    return (
      <ThemedText variant="caption" themeColor="textMuted">
        {t('noRating')}
      </ThemedText>
    );
  }

  return (
    <View style={styles.row}>
      <Ionicons name="star" size={FontSize.small} color={theme.star} />
      <ThemedText variant="small" weight="600">
        {value.toFixed(1).replace('.', ',')}
      </ThemedText>
      {!compact && reviewsCount > 0 ? (
        <ThemedText variant="small" themeColor="textMuted">
          ({reviewsCount} {t('reviews')})
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
});
