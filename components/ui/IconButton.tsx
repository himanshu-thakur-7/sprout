import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/constants/theme';

export type IconButtonVariant = 'floating' | 'plain' | 'fab';

export type IconButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  /**
   * 'floating' — circular surfaceElevated button with soft shadow (back / "…" more, screens 1-4)
   * 'plain' — no background/shadow, just a hit target (e.g. inline "…" menu)
   * 'fab' — larger floating action button (screen 3 "+" button)
   */
  variant?: IconButtonVariant;
  size?: number;
  /** Small dot shown top-right, e.g. the unread badge on the notification bell (screen 3). */
  showBadge?: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
  accessibilityHint?: string;
  testID?: string;
  style?: ViewStyle;
};

const DEFAULT_SIZE: Record<IconButtonVariant, number> = {
  floating: 40,
  plain: 32,
  fab: 56,
};

/** Circular icon-only button: header back/more buttons, notification bell, FAB. */
export function IconButton({
  children,
  onPress,
  variant = 'floating',
  size,
  showBadge = false,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: IconButtonProps) {
  const theme = useTheme();
  const dimension = size ?? DEFAULT_SIZE[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      hitSlop={8}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          width: dimension,
          height: dimension,
          borderRadius: theme.radii.full,
          backgroundColor: variant === 'plain' ? 'transparent' : theme.colors.surfaceElevated,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
        variant === 'floating' && theme.shadows.sm,
        variant === 'fab' && theme.shadows.lg,
        style,
      ]}
    >
      {children}
      {showBadge && (
        <View
          style={[
            styles.badgeDot,
            { backgroundColor: theme.colors.primary, borderColor: theme.colors.surfaceElevated },
          ]}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 999,
    borderWidth: 1.5,
  },
});

export default IconButton;
