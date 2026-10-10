import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CenterPreview } from '@/components/CenterPreview';
import { FilterSheet } from '@/components/FilterSheet';
import { SearchBar } from '@/components/SearchBar';
import { CentersMap, isMapConfigured } from '@/components/map/CentersMap';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ActionButton } from '@/components/ui/ActionButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Radius, Spacing } from '@/constants/theme';
import { useScheme, useTheme } from '@/hooks/use-theme';
import { useVisibleCenters } from '@/hooks/use-visible-centers';
import { useI18n } from '@/i18n';
import { hasActiveFilters } from '@/lib/centers';
import { useCenters } from '@/lib/centers-store';
import { logCenterEvent } from '@/lib/centers';

export default function MapScreen() {
  const theme = useTheme();
  const scheme = useScheme();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const {
    loading,
    filters,
    setFilters,
    sortMode,
    setSortMode,
    districts,
    userLocation,
    locationStatus,
    askLocation,
  } = useCenters();

  const centers = useVisibleCenters();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const selected = useMemo(
    () => centers.find((center) => center.id === selectedId) ?? null,
    [centers, selectedId],
  );

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id) void logCenterEvent(id, 'view');
  }, []);

  // API kaliti yo'q bo'lsa, harita o'rniga tushunarli holat ko'rsatamiz.
  if (!isMapConfigured) {
    return (
      <ThemedView style={[styles.flex, { paddingTop: insets.top }]}>
        <EmptyState icon="map-outline" title={t('mapNoKeyTitle')} body={t('mapNoKeyBody')}>
          <ActionButton
            label={t('mapOpenList')}
            icon="list"
            onPress={() => router.navigate('/list')}
          />
        </EmptyState>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.flex}>
      <CentersMap
        centers={centers}
        userLocation={userLocation}
        selectedId={selectedId}
        onSelectCenter={handleSelect}
        theme={scheme}
      />

      {/* Qidiruv paneli harita ustida suzadi. */}
      <View style={[styles.topBar, { top: insets.top + Spacing.sm }]} pointerEvents="box-none">
        <SearchBar
          value={filters.query}
          onChangeText={(query) => setFilters({ ...filters, query })}
          onPressFilters={() => setFiltersOpen(true)}
          filtersActive={hasActiveFilters(filters)}
        />
        <View style={[styles.countPill, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <ThemedText variant="caption" themeColor="textSecondary">
              {centers.length} {t('mapCentersFound')}
            </ThemedText>
          )}
        </View>
      </View>

      {/* Joylashuvga o'tish tugmasi. */}
      <Pressable
        onPress={askLocation}
        accessibilityRole="button"
        accessibilityLabel={t('mapMyLocation')}
        style={[
          styles.locateButton,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            bottom: (selected ? 260 : 0) + Spacing.lg + insets.bottom,
          },
        ]}
      >
        {locationStatus === 'loading' ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <Ionicons
            name={locationStatus === 'granted' ? 'locate' : 'locate-outline'}
            size={22}
            color={locationStatus === 'denied' ? theme.textMuted : theme.primary}
          />
        )}
      </Pressable>

      {selected ? (
        <View style={[styles.previewWrap, { paddingBottom: insets.bottom + Spacing.sm }]}>
          <CenterPreview
            center={selected}
            onOpenDetails={() => router.push(`/center/${selected.id}`)}
            onClose={() => setSelectedId(null)}
          />
        </View>
      ) : null}

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
  topBar: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    gap: Spacing.sm,
  },
  countPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    borderWidth: 1,
    minHeight: 26,
    justifyContent: 'center',
  },
  locateButton: {
    position: 'absolute',
    right: Spacing.lg,
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  previewWrap: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: 0,
  },
});
