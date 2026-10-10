import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CenterCard } from '@/components/CenterCard';
import { FilterSheet } from '@/components/FilterSheet';
import { SearchBar } from '@/components/SearchBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ActionButton } from '@/components/ui/ActionButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Notice } from '@/components/ui/Notice';
import { Spacing } from '@/constants/theme';
import { useVisibleCenters } from '@/hooks/use-visible-centers';
import { useI18n } from '@/i18n';
import { hasActiveFilters, splitPromoted } from '@/lib/centers';
import { useCenters } from '@/lib/centers-store';
import { useFavorites } from '@/lib/favorites';
import type { CenterWithDistance } from '@/types/center';

export default function ListScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const {
    loading,
    isDemo,
    reload,
    filters,
    setFilters,
    resetFilters,
    sortMode,
    setSortMode,
    districts,
    locationStatus,
    askLocation,
  } = useCenters();
  const { isFavorite, toggle } = useFavorites();

  const centers = useVisibleCenters();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { promoted, regular } = useMemo(() => splitPromoted(centers), [centers]);

  const openCenter = useCallback((id: string) => router.push(`/center/${id}`), []);

  const renderItem = useCallback(
    ({ item }: { item: CenterWithDistance }) => (
      <CenterCard
        center={item}
        onPress={() => openCenter(item.id)}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={() => toggle(item.id)}
      />
    ),
    [isFavorite, toggle, openCenter],
  );

  return (
    <ThemedView style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText variant="heading">{t('listNearby')}</ThemedText>
        <SearchBar
          value={filters.query}
          onChangeText={(query) => setFilters({ ...filters, query })}
          onPressFilters={() => setFiltersOpen(true)}
          filtersActive={hasActiveFilters(filters)}
        />
      </View>

      <FlatList
        data={regular}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + Spacing.xxl }]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {isDemo ? (
              <Notice icon="information-circle" tone="warning" text={t('settingsDataDemo')} />
            ) : null}

            {locationStatus !== 'granted' && locationStatus !== 'loading' ? (
              <Notice
                icon="navigate-circle"
                text={locationStatus === 'denied' ? t('locationDeniedBody') : t('locationAsk')}
                actionLabel={locationStatus === 'denied' ? undefined : t('locationAskButton')}
                onPressAction={locationStatus === 'denied' ? undefined : askLocation}
              />
            ) : null}

            {/* Reklama bloki ochiq belgilangan: ota-ona nima pullik joylashtirilganini ko'radi. */}
            {promoted.length > 0 ? (
              <View style={styles.promotedBlock}>
                <View style={styles.promotedHeader}>
                  <ThemedText variant="small" weight="700" themeColor="accent">
                    {t('listPromoted')}
                  </ThemedText>
                  <ThemedText variant="caption" themeColor="textMuted">
                    {t('listPromotedHint')}
                  </ThemedText>
                </View>
                {promoted.map((center) => (
                  <CenterCard
                    key={`promo-${center.id}`}
                    center={center}
                    promoted
                    onPress={() => openCenter(center.id)}
                    isFavorite={isFavorite(center.id)}
                    onToggleFavorite={() => toggle(center.id)}
                  />
                ))}
              </View>
            ) : null}

            {regular.length > 0 ? (
              <ThemedText variant="caption" themeColor="textMuted">
                {regular.length} {t('listResults')}
              </ThemedText>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          loading ? null : (
            <EmptyState icon="search-outline" title={t('listEmptyTitle')} body={t('listEmptyBody')}>
              {hasActiveFilters(filters) || filters.query ? (
                <ActionButton
                  label={t('clear')}
                  variant="secondary"
                  onPress={() => {
                    resetFilters();
                    setSortMode('distance');
                  }}
                />
              ) : null}
            </EmptyState>
          )
        }
      />

      <FilterSheet
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        sortMode={sortMode}
        districts={districts}
        onApply={(nextFilters, nextSort) => {
          setFilters(nextFilters);
          setSortMode(nextSort);
          setFiltersOpen(false);
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { padding: Spacing.lg, gap: Spacing.md },
  listContent: { paddingHorizontal: Spacing.lg, flexGrow: 1 },
  listHeader: { gap: Spacing.md, paddingBottom: Spacing.md },
  promotedBlock: { gap: Spacing.sm },
  promotedHeader: { gap: 2 },
  separator: { height: Spacing.md },
});
