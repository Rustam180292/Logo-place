import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { formatDistance, formatPrice, isOpenAt } from '@/lib/geo';
import type { CenterWithDistance, ServiceKey } from '@/types/center';

/** Kartochkada ko'rsatiladigan xizmatlar soni — qolganlari "+N" bo'ladi. */
const VISIBLE_SERVICES = 2;

export interface CenterCardProps {
  center: CenterWithDistance;
  onPress: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  /** Reklama blokida ko'rsatilayotganini bildiradi. */
  promoted?: boolean;
}

export function CenterCard({
  center,
  onPress,
  isFavorite,
  onToggleFavorite,
  promoted = false,
}: CenterCardProps) {
  const theme = useTheme();
  const { t, pick } = useI18n();

  const name = pick(center.name, center.name_ru);
  const address = pick(center.address, center.address_ru);
  const openState = isOpenAt(center.working_hours);
  const distance = formatDistance(center.distanceKm, t('km'));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={name}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: promoted ? theme.accent : theme.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <ThemedText variant="title" numberOfLines={2}>
            {name}
          </ThemedText>
          <View style={styles.metaRow}>
            <Rating value={center.rating} reviewsCount={center.reviews_count} compact />
            {distance ? (
              <>
                <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                <ThemedText variant="small" themeColor="textSecondary">
                  {distance}
                </ThemedText>
              </>
            ) : null}
            {openState !== null ? (
              <>
                <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                <ThemedText
                  variant="small"
                  style={{ color: openState ? theme.success : theme.danger }}
                >
                  {openState ? t('openNow') : t('closedNow')}
                </ThemedText>
              </>
            ) : null}
          </View>
        </View>

        <Pressable
          onPress={onToggleFavorite}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? t('savedToFavorites') : t('saveToFavorites')}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? theme.danger : theme.textMuted}
          />
        </Pressable>
      </View>

      <View style={styles.addressRow}>
        <Ionicons name="location-outline" size={FontSize.body} color={theme.textMuted} />
        <ThemedText variant="small" themeColor="textSecondary" numberOfLines={1} style={styles.flex}>
          {address}
        </ThemedText>
      </View>

      <View style={styles.badges}>
        {promoted ? <Badge label={t('listPromoted')} tone="accent" icon="megaphone" /> : null}
        {center.is_verified ? (
          <Badge label={t('verified')} tone="success" icon="shield-checkmark" />
        ) : null}
        {center.services.slice(0, VISIBLE_SERVICES).map((service) => (
          <Badge key={service} label={t(`service.${service}` as `service.${ServiceKey}`)} />
        ))}
        {center.services.length > VISIBLE_SERVICES ? (
          <Badge label={`+${center.services.length - VISIBLE_SERVICES}`} />
        ) : null}
      </View>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <ThemedText variant="small" weight="600" themeColor={center.price_from ? 'text' : 'textMuted'}>
          {center.price_from
            ? `${t('priceFrom')} ${formatPrice(center.price_from)} ${t('soum')}`
            : t('priceUnknown')}
        </ThemedText>
        <Ionicons name="chevron-forward" size={FontSize.title} color={theme.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  headerText: { flex: 1, gap: Spacing.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  dot: { width: 3, height: 3, borderRadius: 2 },
  favoriteButton: { padding: Spacing.xs },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  flex: { flex: 1 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.md,
  },
});
