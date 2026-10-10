import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/ActionButton';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { callCenter, openRoute } from '@/lib/actions';
import { formatDistance, formatPrice } from '@/lib/geo';
import type { CenterWithDistance } from '@/types/center';

export interface CenterPreviewProps {
  center: CenterWithDistance;
  onOpenDetails: () => void;
  onClose: () => void;
}

/** Haritada belgi bosilganda pastda chiqadigan qisqa kartochka. */
export function CenterPreview({ center, onOpenDetails, onClose }: CenterPreviewProps) {
  const theme = useTheme();
  const { t, pick } = useI18n();
  const distance = formatDistance(center.distanceKm, t('km'));

  return (
    <View style={[styles.sheet, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Pressable onPress={onOpenDetails} style={styles.headerText} accessibilityRole="button">
          <ThemedText variant="title" numberOfLines={2}>
            {pick(center.name, center.name_ru)}
          </ThemedText>
          <View style={styles.metaRow}>
            <Rating value={center.rating} reviewsCount={center.reviews_count} compact />
            {distance ? (
              <ThemedText variant="small" themeColor="textSecondary">
                {distance}
              </ThemedText>
            ) : null}
          </View>
        </Pressable>
        <Pressable
          onPress={onClose}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={t('close')}
        >
          <Ionicons name="close" size={22} color={theme.textMuted} />
        </Pressable>
      </View>

      <View style={styles.badges}>
        {center.tier === 'premium' ? (
          <Badge label={t('listPromoted')} tone="accent" icon="megaphone" />
        ) : null}
        {center.is_verified ? (
          <Badge label={t('verified')} tone="success" icon="shield-checkmark" />
        ) : null}
        <Badge
          label={
            center.price_from
              ? `${t('priceFrom')} ${formatPrice(center.price_from)} ${t('soum')}`
              : t('priceUnknown')
          }
        />
      </View>

      <View style={styles.addressRow}>
        <Ionicons name="location-outline" size={FontSize.body} color={theme.textMuted} />
        <ThemedText variant="small" themeColor="textSecondary" numberOfLines={2} style={styles.flex}>
          {pick(center.address, center.address_ru)}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <ActionButton
          label={t('call')}
          icon="call"
          onPress={() => void callCenter(center)}
          style={styles.flex}
        />
        <ActionButton
          label={t('route')}
          icon="navigate"
          variant="secondary"
          onPress={() => void openRoute(center)}
          style={styles.flex}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
    // Harita ustida yaxshi ajralib turishi uchun soya.
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  headerText: { flex: 1, gap: Spacing.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flexWrap: 'wrap' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xs },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  flex: { flex: 1 },
});
