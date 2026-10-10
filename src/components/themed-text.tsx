import { StyleSheet, Text, type TextProps } from 'react-native';

import { FontSize, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TextVariant =
  | 'display'
  | 'heading'
  | 'title'
  | 'body'
  | 'small'
  | 'caption';

export type ThemedTextProps = TextProps & {
  variant?: TextVariant;
  themeColor?: ThemeColor;
  /** Shrift qalinligi; berilmasa variant standartidan olinadi. */
  weight?: '400' | '500' | '600' | '700';
};

export function ThemedText({
  style,
  variant = 'body',
  themeColor,
  weight,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        styles[variant],
        weight ? { fontWeight: weight } : null,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  display: { fontSize: FontSize.display, lineHeight: 34, fontWeight: '700' },
  heading: { fontSize: FontSize.heading, lineHeight: 28, fontWeight: '700' },
  title: { fontSize: FontSize.title, lineHeight: 23, fontWeight: '600' },
  body: { fontSize: FontSize.body, lineHeight: 21, fontWeight: '400' },
  small: { fontSize: FontSize.small, lineHeight: 18, fontWeight: '400' },
  caption: { fontSize: FontSize.caption, lineHeight: 16, fontWeight: '500' },
});
