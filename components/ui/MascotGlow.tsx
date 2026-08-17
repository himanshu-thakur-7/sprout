import React, { useEffect } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useTheme } from '@/constants/theme';

export type MascotGlowSize = 'sm' | 'md' | 'lg';

const SIZES: Record<MascotGlowSize, number> = {
  sm: 56, // header avatar spot (screens 1, 3)
  md: 96,
  lg: 140, // hero mascot (screens 2, 4)
};

export type MascotGlowProps = {
  size?: MascotGlowSize;
  /**
   * Real mascot illustration/PNG/Lottie still-frame to render instead of the
   * placeholder glyph. Drop the production asset in and this becomes a
   * simple swap — the glow + idle animation stay the same.
   */
  source?: ImageSourcePropType;
  /** Fully custom center content (e.g. a future Lottie/SVG mascot component). */
  children?: React.ReactNode;
  /** Disable the idle bob + glow pulse (e.g. for a static list thumbnail). */
  animated?: boolean;
};

/**
 * Placeholder for the sprout mascot: a soft amber radial glow with a
 * gently bobbing, gently pulsing center glyph. Built to be a drop-in swap
 * once the real illustration/animation asset exists — the glow, sizing,
 * and idle-motion contract stay identical.
 */
export function MascotGlow({ size = 'md', source, children, animated = true }: MascotGlowProps) {
  const theme = useTheme();
  const dimension = SIZES[size];
  const bob = useSharedValue(0);
  const glowPulse = useSharedValue(0.6);

  useEffect(() => {
    if (!animated) return;
    bob.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.6, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [animated]);

  const bobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowPulse.value,
  }));

  return (
    <View
      style={{ width: dimension, height: dimension }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View style={[StyleSheet.absoluteFill, glowStyle]}>
        <Svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
          <Defs>
            <RadialGradient id="mascotGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={theme.colors.accent} stopOpacity={0.55} />
              <Stop offset="100%" stopColor={theme.colors.accent} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={dimension / 2} cy={dimension / 2} r={dimension / 2} fill="url(#mascotGlow)" />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.center, bobStyle]}>
        {children ??
          (source ? (
            <Image
              source={source}
              style={{ width: dimension * 0.6, height: dimension * 0.6 }}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          ) : (
            <Text style={{ fontSize: dimension * 0.42 }}>🌱</Text>
          ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MascotGlow;
