import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';

// -----------------------------------------------------------------------
// WeeklyProgressBar — the 7-segment pill bar under each habit row on the
// "This Week" screen (screen 2). Segments fill left→right up to `filled`.
// -----------------------------------------------------------------------

export type WeeklyProgressBarProps = {
  /** Number of segments filled, counted from the start. */
  filled: number;
  total?: number;
  accessibilityLabel?: string;
};

export function WeeklyProgressBar({ filled, total = 7, accessibilityLabel }: WeeklyProgressBarProps) {
  const clampedFilled = Math.max(0, Math.min(total, filled));

  return (
    <View
      style={styles.segmentedRow}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? 'Weekly progress'}
      accessibilityValue={{ min: 0, max: total, now: clampedFilled }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <Segment key={index} index={index} isFilled={index < clampedFilled} />
      ))}
    </View>
  );
}

function Segment({ index, isFilled }: { index: number; isFilled: boolean }) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * 40,
      withTiming(isFilled ? 1 : 0, { duration: 260, easing: Easing.out(Easing.cubic) })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFilled]);

  const style = useAnimatedStyle(() => ({
    backgroundColor: isFilled ? theme.colors.primary : theme.colors.surfaceSunken,
    opacity: 0.4 + progress.value * 0.6,
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          flex: 1,
          height: 7,
          borderRadius: theme.radii.full,
          marginRight: index === 6 ? 0 : theme.spacing[1],
        },
      ]}
    />
  );
}

// -----------------------------------------------------------------------
// WeeklyBarChart — the variable-height Mon–Sun bar chart on the habit
// detail screen (screen 4), with an optional amber marker dot over the
// highlighted bar.
// -----------------------------------------------------------------------

export type WeeklyBarChartDatum = {
  label: string;
  /** Raw value, e.g. minutes read. 0/undefined renders an empty bar. */
  value?: number;
  /** Marks this bar with the amber attention dot (e.g. "today"). */
  highlighted?: boolean;
};

export type WeeklyBarChartProps = {
  data: WeeklyBarChartDatum[];
  /** Normalizes bar heights; defaults to the max value in `data`. */
  max?: number;
  height?: number;
  accessibilityLabel?: string;
};

export function WeeklyBarChart({ data, max, height = 120, accessibilityLabel }: WeeklyBarChartProps) {
  const theme = useTheme();
  const maxValue = max ?? Math.max(1, ...data.map((d) => d.value ?? 0));

  return (
    <View
      accessible
      accessibilityLabel={
        accessibilityLabel ?? `Weekly chart: ${data.map((d) => `${d.label} ${d.value ?? 0}`).join(', ')}`
      }
    >
      <View style={[styles.chartRow, { height }]}>
        {data.map((datum, index) => (
          <Bar key={datum.label} datum={datum} index={index} maxValue={maxValue} chartHeight={height} />
        ))}
      </View>
      <View style={styles.chartLabels}>
        {data.map((datum) => (
          <Text key={datum.label} style={[theme.typography.caption, styles.chartLabel, { color: theme.colors.textSecondary }]}>
            {datum.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

function Bar({
  datum,
  index,
  maxValue,
  chartHeight,
}: {
  datum: WeeklyBarChartDatum;
  index: number;
  maxValue: number;
  chartHeight: number;
}) {
  const theme = useTheme();
  const hasValue = !!datum.value;
  const targetHeight = hasValue ? Math.max(6, (datum.value! / maxValue) * chartHeight) : 6;
  const animatedHeight = useSharedValue(0);

  useEffect(() => {
    animatedHeight.value = withDelay(
      index * 45,
      withTiming(targetHeight, { duration: 380, easing: Easing.out(Easing.cubic) })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetHeight]);

  const style = useAnimatedStyle(() => ({ height: animatedHeight.value }));

  return (
    <View style={styles.barSlot}>
      {datum.highlighted && (
        <View style={[styles.marker, { backgroundColor: theme.colors.accent }]} />
      )}
      <Animated.View
        style={[
          style,
          {
            width: 26,
            borderTopLeftRadius: theme.radii.sm,
            borderTopRightRadius: theme.radii.sm,
            backgroundColor: hasValue ? theme.colors.primary : theme.colors.surfaceSunken,
            borderWidth: hasValue ? 0 : 1,
            borderColor: theme.colors.border,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  segmentedRow: {
    flexDirection: 'row',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabel: {
    width: 26,
    textAlign: 'center',
  },
  barSlot: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  marker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 6,
  },
});

export default WeeklyProgressBar;
