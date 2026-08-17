import React, { useEffect } from 'react';
import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/constants/theme';

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 32;
const KNOB_SIZE = 28;
const KNOB_TRAVEL = TRACK_WIDTH - KNOB_SIZE - 4; // 2px padding each side
const GLOW_PADDING = 10; // how far the halo extends past the track on each side

export type ToggleProps = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  accessibilityLabel: string;
  testID?: string;
};

/**
 * The one-tap habit-complete switch (screen 1). Off = hollow cream track
 * with a plain white knob. On = sage-600 track, white knob with a
 * checkmark, and a brief soft green glow bloom to celebrate completion.
 *
 * The glow is a separate, static-shadow halo layer behind the track whose
 * *opacity* is animated, rather than animating shadowOpacity/shadowRadius
 * directly — the latter doesn't reliably render on React Native Web (there's
 * no CSS equivalent RN's shadow-mutation-per-frame reliably maps to), while
 * opacity animates identically on iOS/Android/web.
 */
export function Toggle({ value, onValueChange, disabled, accessibilityLabel, testID }: ToggleProps) {
  const theme = useTheme();
  const progress = useSharedValue(value ? 1 : 0);
  const glow = useSharedValue(0);

  useEffect(() => {
    const wasOn = progress.value > 0.5;
    progress.value = withTiming(value ? 1 : 0, { duration: 220, easing: Easing.out(Easing.cubic) });
    if (value && !wasOn) {
      glow.value = withSequence(withTiming(1, { duration: 180 }), withTiming(0, { duration: 420 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [theme.colors.surfaceSunken, theme.colors.success]),
    borderColor: interpolateColor(progress.value, [0, 1], [theme.colors.border, theme.colors.success]),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * KNOB_TRAVEL }],
  }));

  // Stop the press from bubbling to a parent card's own Pressable (e.g. a
  // HabitCard that navigates on tap) — on native this is normally moot
  // since the innermost responder wins, but React Native Web builds
  // Pressable on ordinary DOM click bubbling, so without this a tap on the
  // toggle would *also* fire the card's onPress.
  const handlePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (!disabled) onValueChange(!value);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      hitSlop={8}
      testID={testID}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Animated.View
        style={[
          glowStyle,
          {
            position: 'absolute',
            top: -GLOW_PADDING,
            left: -GLOW_PADDING,
            right: -GLOW_PADDING,
            bottom: -GLOW_PADDING,
            borderRadius: theme.radii.full,
            backgroundColor: theme.colors.glowSage,
            shadowColor: theme.colors.success,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            pointerEvents: 'none',
          },
        ]}
      />

      <Animated.View
        style={[
          styles.track,
          trackStyle,
          {
            width: TRACK_WIDTH,
            height: TRACK_HEIGHT,
            borderRadius: theme.radii.full,
            borderWidth: 1,
          },
          theme.shadows.sm,
        ]}
      >
        <Animated.View
          style={[
            knobStyle,
            styles.knob,
            {
              width: KNOB_SIZE,
              height: KNOB_SIZE,
              borderRadius: theme.radii.full,
              backgroundColor: '#FFFFFF',
            },
            theme.shadows.sm,
          ]}
        >
          {value && <Ionicons name="checkmark" size={16} color={theme.colors.success} />}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    padding: 2,
  },
  knob: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Toggle;
