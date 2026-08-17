import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/constants/theme';

export type IconCircleSize = 'sm' | 'md' | 'lg';

const SIZES: Record<IconCircleSize, number> = {
  sm: 32,
  md: 44, // theme.layout.iconCircleSize — default, matches every habit-row icon
  lg: 56,
};

export type IconCircleProps = {
  /** Icon element to render centered inside the circle, e.g. an Ionicons glyph. */
  children: React.ReactNode;
  size?: IconCircleSize;
  /** Overrides the default sage-tint background (e.g. a per-habit accent color). */
  backgroundColor?: string;
  style?: ViewStyle;
};

/**
 * The soft sage-tinted circular icon container used as the leading element
 * in every habit row, circle-card header, and history row across the app.
 */
export function IconCircle({ children, size = 'md', backgroundColor, style }: IconCircleProps) {
  const theme = useTheme();
  const dimension = SIZES[size];

  return (
    <View
      style={[
        styles.base,
        {
          width: dimension,
          height: dimension,
          borderRadius: theme.radii.full,
          backgroundColor: backgroundColor ?? theme.colors.primaryMuted,
        },
        style,
      ]}
      importantForAccessibility="no"
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconCircle;
