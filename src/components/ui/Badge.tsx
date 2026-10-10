import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BadgeTone = 'primary' | 'accent' | 'success' | 'neutral';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function Badge({ label, tone = 'neutral', icon }: BadgeProps) {
  const theme = useTheme();
  const palette: Record<BadgeTone, { bg: string; fg: string }> = {
    primary: { bg: theme.primarySoft, fg: theme.primary },
    accent: { bg: theme.accentSoft, fg: theme.accent },
    success: { bg: theme.primarySoft, fg: theme.success },
    neutral: { bg: theme.backgroundAlt, fg: theme.textSecondary },
  };
  const { bg, fg } = palette[tone];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {icon ? <Ionicons name={icon} size={FontSize.caption} color={fg} /> : null}
      <ThemedText variant="caption" style={{ color: fg }} numberOfLines={1}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
});
