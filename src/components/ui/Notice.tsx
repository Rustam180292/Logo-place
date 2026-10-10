import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type NoticeTone = 'info' | 'warning';

export interface NoticeProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  tone?: NoticeTone;
  /** Bosiladigan harakat matni, masalan "Ruxsat berish". */
  actionLabel?: string;
  onPressAction?: () => void;
}

/** Ekran tepasida chiqadigan qisqa ma'lumot satri. */
export function Notice({
  icon,
  text,
  tone = 'info',
  actionLabel,
  onPressAction,
}: NoticeProps) {
  const theme = useTheme();
  const background = tone === 'warning' ? theme.accentSoft : theme.primarySoft;
  const foreground = tone === 'warning' ? theme.accent : theme.primary;

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Ionicons name={icon} size={FontSize.title} color={foreground} />
      <ThemedText variant="small" style={[styles.text, { color: foreground }]}>
        {text}
      </ThemedText>
      {actionLabel && onPressAction ? (
        <Pressable onPress={onPressAction} hitSlop={8} accessibilityRole="button">
          <ThemedText variant="small" weight="700" style={{ color: foreground }}>
            {actionLabel}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  text: { flex: 1 },
});
