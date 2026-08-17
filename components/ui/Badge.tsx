import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/theme';

export type BadgeVariant = 'solid' | 'outline';

export type BadgeProps = {
  label: string;
  icon?: React.ReactNode;
  /**
   * 'solid' — sage-tint pill, e.g. the "Daily" frequency tag (screen 4).
   * 'outline' — cream pill with a hairline border, e.g. the "4 day streak 🔥" badge.
   */
  variant?: BadgeVariant;
  color?: string;
};

/** Small pill tag — frequency labels, streak counters, status chips. */
export function Badge({ label, icon, variant = 'solid', color }: BadgeProps) {
  const theme = useTheme();
  const isSolid = variant === 'solid';

  return (
    <View
      accessibilityRole="text"
      style={[
        styles.base,
        {
          borderRadius: theme.radii.full,
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[1],
          backgroundColor: isSolid ? theme.colors.primaryMuted : theme.colors.surfaceElevated,
          borderWidth: isSolid ? 0 : 1,
          borderColor: theme.colors.border,
        },
        isSolid && theme.shadows.none,
        !isSolid && theme.shadows.sm,
      ]}
    >
      {icon}
      <Text
        style={[
          theme.typography.tiny,
          { color: color ?? (isSolid ? theme.colors.primaryText : theme.colors.textSecondary) },
          icon ? { marginLeft: theme.spacing[1] } : null,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
});

export default Badge;
