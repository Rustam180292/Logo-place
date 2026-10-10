import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ActionButton } from '@/components/ui/ActionButton';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Rating } from '@/components/ui/Rating';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import {
  callCenter,
  openInstagram,
  openRoute,
  openTelegram,
  openWebsite,
  shareCenter,
} from '@/lib/actions';
import { fetchCenterById, logCenterEvent } from '@/lib/centers';
import { useCenters } from '@/lib/centers-store';
import { useFavorites } from '@/lib/favorites';
import { distanceKm, formatDistance, formatPrice, isOpenAt, weekDayKey } from '@/lib/geo';
import type { Center, WeekDay } from '@/types/center';

const WEEK_ORDER: WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export default function CenterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t, pick } = useI18n();
  const { centers, userLocation } = useCenters();
  const { isFavorite, toggle } = useFavorites();

  // Avval do'kondagi ro'yxatdan izlaymiz — ekran darhol ochiladi.
  const cached = useMemo(() => centers.find((center) => center.id === id) ?? null, [centers, id]);
  const [center, setCenter] = useState<Center | null>(cached);
  const [loading, setLoading] = useState(cached === null);

  useEffect(() => {
    if (cached) {
      setCenter(cached);
      setLoading(false);
      return;
    }
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    fetchCenterById(id)
      .then((result) => {
        if (!cancelled) setCenter(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, cached]);

  useEffect(() => {
    if (center) void logCenterEvent(center.id, 'view');
  }, [center]);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator color={theme.primary} />
      </ThemedView>
    );
  }

  if (!center) {
    return (
      <ThemedView style={styles.flex}>
        <EmptyState icon="alert-circle-outline" title={t('centerNotFound')} />
      </ThemedView>
    );
  }

  const name = pick(center.name, center.name_ru);
  const description = pick(center.description, center.description_ru);
  const address = pick(center.address, center.address_ru);
  const priceNote = pick(center.price_note, center.price_note_ru);
  const openState = isOpenAt(center.working_hours);
  const distance = userLocation
    ? formatDistance(
        distanceKm(userLocation, { lat: center.lat, lng: center.lng }),
        t('km'),
      )
    : '';
  const favorite = isFavorite(center.id);
  const today = weekDayKey(new Date());

  return (
    <ThemedView style={styles.flex}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => toggle(center.id)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={favorite ? t('savedToFavorites') : t('saveToFavorites')}
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={24}
                color={favorite ? theme.danger : theme.text}
              />
            </Pressable>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <ThemedText variant="display">{name}</ThemedText>
          <View style={styles.metaRow}>
            <Rating value={center.rating} reviewsCount={center.reviews_count} />
            {distance ? (
              <ThemedText variant="small" themeColor="textSecondary">
                {distance}
              </ThemedText>
            ) : null}
            {openState !== null ? (
              <ThemedText
                variant="small"
                weight="600"
                style={{ color: openState ? theme.success : theme.danger }}
              >
                {openState ? t('openNow') : t('closedNow')}
              </ThemedText>
            ) : null}
          </View>
          <View style={styles.badges}>
            {center.tier === 'premium' ? (
              <Badge label={t('premium')} tone="accent" icon="star" />
            ) : null}
            {center.is_verified ? (
              <Badge label={t('verified')} tone="success" icon="shield-checkmark" />
            ) : null}
          </View>
        </View>

        <View style={styles.actionRow}>
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
          <ActionButton
            label={t('share')}
            icon="share-outline"
            variant="secondary"
            onPress={() => void shareCenter(center, t('appName'))}
          />
        </View>

        {description ? (
          <Section title={t('aboutCenter')}>
            <ThemedText variant="body" themeColor="textSecondary">
              {description}
            </ThemedText>
          </Section>
        ) : null}

        <Section title={t('services')}>
          <View style={styles.badges}>
            {center.services.map((service) => (
              <Badge key={service} label={t(`service.${service}`)} tone="primary" />
            ))}
          </View>
        </Section>

        <Section title={t('ageGroups')}>
          <View style={styles.badges}>
            {center.age_groups.map((age) => (
              <Badge key={age} label={t(`age.${age}`)} />
            ))}
          </View>
        </Section>

        <Section title={t('priceSection')}>
          <ThemedText variant="title">
            {center.price_from
              ? `${t('priceFrom')} ${formatPrice(center.price_from)} ${t('soum')}`
              : t('priceUnknown')}
          </ThemedText>
          {priceNote ? (
            <ThemedText variant="small" themeColor="textSecondary">
              {priceNote}
            </ThemedText>
          ) : null}
        </Section>

        {center.working_hours ? (
          <Section title={t('workingHours')}>
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {WEEK_ORDER.map((day) => {
                const hours = center.working_hours?.[day];
                const isToday = day === today;
                return (
                  <View key={day} style={styles.hoursRow}>
                    <ThemedText
                      variant="small"
                      weight={isToday ? '700' : '400'}
                      themeColor={isToday ? 'text' : 'textSecondary'}
                      style={styles.flex}
                    >
                      {t(`day.${day}`)}
                    </ThemedText>
                    <ThemedText
                      variant="small"
                      weight={isToday ? '700' : '400'}
                      themeColor={hours ? 'text' : 'textMuted'}
                    >
                      {hours ? `${hours.open} – ${hours.close}` : t('dayOff')}
                    </ThemedText>
                  </View>
                );
              })}
            </View>
          </Section>
        ) : null}

        <Section title={t('addressSection')}>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={FontSize.title} color={theme.textMuted} />
            <ThemedText variant="body" style={styles.flex}>
              {address}
            </ThemedText>
          </View>
          {center.district ? (
            <ThemedText variant="small" themeColor="textSecondary">
              {center.district}, {center.city}
            </ThemedText>
          ) : null}
        </Section>

        <Section title={t('contacts')}>
          <ContactRow
            icon="call-outline"
            label={center.phone}
            onPress={() => void callCenter(center)}
          />
          {center.phone_alt ? (
            <ContactRow
              icon="call-outline"
              label={center.phone_alt}
              onPress={() => void callCenter(center, center.phone_alt ?? undefined)}
            />
          ) : null}
          {center.telegram ? (
            <ContactRow
              icon="paper-plane-outline"
              label={t('openInTelegram')}
              onPress={() => void openTelegram(center)}
            />
          ) : null}
          {center.instagram ? (
            <ContactRow
              icon="logo-instagram"
              label={t('openInInstagram')}
              onPress={() => void openInstagram(center)}
            />
          ) : null}
          {center.website ? (
            <ContactRow
              icon="globe-outline"
              label={t('openWebsite')}
              onPress={() => void openWebsite(center)}
            />
          ) : null}
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

function ContactRow({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        styles.contactRow,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={theme.primary} />
      <ThemedText variant="body" style={styles.flex}>
        {label}
      </ThemedText>
      <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.lg, gap: Spacing.xl },
  headerBlock: { gap: Spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, flexWrap: 'wrap' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  actionRow: { flexDirection: 'row', gap: Spacing.sm },
  section: { gap: Spacing.sm },
  card: { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.lg },
  hoursRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
});
