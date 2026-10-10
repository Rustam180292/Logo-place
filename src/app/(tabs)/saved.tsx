import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CenterCard } from '@/components/CenterCard';
import { ThemedView } from '@/components/themed-view';
import { ActionButton } from '@/components/ui/ActionButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spacing } from '@/constants/theme';
import { useI18n } from '@/i18n';
import { withDistance } from '@/lib/centers';
import { useCenters } from '@/lib/centers-store';
import { useFavorites } from '@/lib/favorites';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { centers, userLocation } = useCenters();
  const { ids, isFavorite, toggle } = useFavorites();

  // Saqlanganlar filtrlardan qat'i nazar ko'rsatiladi, lekin tartib
  // foydalanuvchi saqlagan ketma-ketlikni saqlaydi.
  const saved = useMemo(() => {
    const measured = withDistance(centers, userLocation);
    const byId = new Map(measured.map((center) => [center.id, center]));
    return ids.map((id) => byId.get(id)).filter((center) => center !== undefined);
  }, [centers, userLocation, ids]);

  if (saved.length === 0) {
    return (
      <ThemedView style={styles.flex}>
        <EmptyState
          icon="heart-outline"
          title={t('savedEmptyTitle')}
          body={t('savedEmptyBody')}
        >
          <ActionButton
            label={t('mapOpenList')}
            icon="list"
            variant="secondary"
            onPress={() => router.navigate('/list')}
          />
        </EmptyState>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.flex}>
      <FlatList
        data={saved}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CenterCard
            center={item}
            onPress={() => router.push(`/center/${item.id}`)}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggle(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xxl },
        ]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.lg },
  separator: { height: Spacing.md },
});
