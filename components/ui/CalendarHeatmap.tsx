import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';

export type HeatmapCellState = 'empty' | 'filled' | 'highlight';

export type CalendarHeatmapProps = {
  /** Rows of 7 (Mon–Sun) cell states — one row per week, e.g. W1–W4. */
  weeks: HeatmapCellState[][];
  cellSize?: number;
  accessibilityLabel?: string;
};

/** The "This Month" completion grid on the habit detail screen (screen 4). */
export function CalendarHeatmap({ weeks, cellSize = 28, accessibilityLabel }: CalendarHeatmapProps) {
  const theme = useTheme();

  return (
    <View accessible accessibilityLabel={accessibilityLabel ?? 'Monthly completion calendar'}>
      {weeks.map((week, weekIndex) => (
        <View
          key={weekIndex}
          style={[styles.row, { marginBottom: weekIndex === weeks.length - 1 ? 0 : theme.spacing[1] }]}
        >
          {week.map((state, dayIndex) => (
            <Cell key={dayIndex} state={state} size={cellSize} />
          ))}
        </View>
      ))}
    </View>
  );
}

function Cell({ state, size }: { state: HeatmapCellState; size: number }) {
  const theme = useTheme();
  const pulse = useSharedValue(0.5);

  useEffect(() => {
    if (state !== 'highlight') return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [state]);

  // Opacity-driven halo behind the cell, not an animated shadowOpacity —
  // the latter doesn't reliably render on React Native Web.
  const glowStyle = useAnimatedStyle(() => ({
    opacity: state === 'highlight' ? pulse.value : 0,
  }));

  const backgroundColor =
    state === 'filled' ? theme.colors.primary : state === 'highlight' ? theme.colors.accent : theme.colors.surfaceSunken;

  return (
    <View style={{ width: size, height: size, marginRight: theme.spacing[1] }}>
      {state === 'highlight' && (
        <Animated.View
          style={[
            glowStyle,
            {
              position: 'absolute',
              top: -4,
              left: -4,
              right: -4,
              bottom: -4,
              borderRadius: theme.radii.sm,
              backgroundColor: theme.colors.glowAmber,
              shadowColor: theme.colors.accent,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 10,
              pointerEvents: 'none',
            },
          ]}
        />
      )}
      <View style={{ width: size, height: size, borderRadius: theme.radii.sm, backgroundColor }} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

export default CalendarHeatmap;
