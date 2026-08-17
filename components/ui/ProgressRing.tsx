import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type ProgressRingProps = {
  /** 0–1 progress. e.g. 5/7 habits → 5/7. */
  progress: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  /** Big centered number, e.g. "5/7". Pass null to render a bare ring. */
  valueLabel?: string | null;
  /** Small caps caption under the number, e.g. "HABITS THIS WEEK". */
  caption?: string;
  animationDuration?: number;
  testID?: string;
};

/**
 * The weekly-habits progress ring from screen 1. Built on react-native-svg
 * so the arc is a real animatable stroke (strokeDashoffset), not a static
 * image — swap in a Lottie/Skia ring later without touching the API.
 */
export function ProgressRing({
  progress,
  size = 220,
  strokeWidth = 14,
  trackColor,
  progressColor,
  valueLabel,
  caption,
  animationDuration = 700,
  testID,
}: ProgressRingProps) {
  const theme = useTheme();
  const clamped = Math.max(0, Math.min(1, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(clamped, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clamped]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  const percentLabel = `${Math.round(clamped * 100)}%`;

  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      accessibilityLabel={caption ?? 'Progress'}
      testID={testID}
    >
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor ?? theme.colors.primaryMuted}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor ?? theme.colors.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
        />
      </Svg>

      {valueLabel !== null && (
        <View style={{ alignItems: 'center' }}>
          <Text style={[theme.typography.statXl, { color: theme.colors.textPrimary }]}>
            {valueLabel ?? percentLabel}
          </Text>
          {caption && (
            <Text
              style={[
                theme.typography.labelCaps,
                { color: theme.colors.textTertiary, marginTop: theme.spacing[1] },
              ]}
            >
              {caption}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

export default ProgressRing;
