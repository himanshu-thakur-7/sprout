import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { IconCircle } from './IconCircle';
import { Toggle } from './Toggle';

export type HabitCardProps = {
  /** Leading glyph, e.g. <Ionicons name="water-outline" .../>. */
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Tint for the leading icon circle (defaults to the primary sage tint). */
  iconBackgroundColor?: string;

  /**
   * Toggle mode (screen 1 "Today"): pass `completed` + `onToggle` to render
   * the built-in switch and get the whole-row completion glow for free.
   */
  completed?: boolean;
  onToggle?: (next: boolean) => void;

  /**
   * Progress mode (screen 2 "This Week"): pass any trailing content (e.g. a
   * "4 of 7" stat) and/or a footer (e.g. <WeeklyProgressBar .../>) instead
   * of the toggle. `trailing` takes precedence over the built-in toggle.
   */
  trailing?: React.ReactNode;
  footer?: React.ReactNode;

  /** Optional row tap, e.g. navigate to the habit detail screen. */
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
};

/**
 * The habit list row used on both the "Today" and "This Week" screens.
 * Same shell, two content modes — see `trailing`/`footer` vs
 * `completed`/`onToggle` above.
 */
export function HabitCard({
  icon,
  title,
  subtitle,
  iconBackgroundColor,
  completed,
  onToggle,
  trailing,
  footer,
  onPress,
  disabled,
  testID,
}: HabitCardProps) {
  const theme = useTheme();
  const isToggleMode = !trailing && !!onToggle;
  const glow = useSharedValue(0);

  useEffect(() => {
    if (isToggleMode && completed) {
      glow.value = withSequence(withTiming(1, { duration: 200 }), withTiming(0, { duration: 500 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed, isToggleMode]);

  // Animates opacity of a dedicated halo layer rather than shadowOpacity/
  // shadowRadius directly — the latter doesn't reliably render on React
  // Native Web, while opacity animates identically everywhere.
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  const content = (
    <Animated.View
      testID={onPress ? undefined : testID}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[4],
        },
        theme.shadows.sm,
      ]}
    >
      {isToggleMode && (
        <Animated.View
          style={[
            glowStyle,
            styles.glowLayer,
            {
              borderRadius: theme.radii.lg,
              backgroundColor: theme.colors.glowSage,
              shadowColor: theme.colors.success,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              pointerEvents: 'none',
            },
          ]}
        />
      )}

      <View style={styles.row}>
        <IconCircle backgroundColor={iconBackgroundColor}>{icon}</IconCircle>

        <View style={[styles.textStack, { marginLeft: theme.spacing[3] }]}>
          <Text style={[theme.typography.title, { color: theme.colors.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[theme.typography.subtitle, { color: theme.colors.textSecondary, marginTop: 2 }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {trailing ??
          (onToggle && (
            <Toggle
              value={!!completed}
              onValueChange={onToggle}
              disabled={disabled}
              accessibilityLabel={`Mark ${title} as ${completed ? 'not done' : 'done'}`}
            />
          ))}
      </View>

      {footer && <View style={{ marginTop: theme.spacing[3] }}>{footer}</View>}
    </Animated.View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      testID={testID}
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  glowLayer: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStack: {
    flex: 1,
  },
});

export default HabitCard;
