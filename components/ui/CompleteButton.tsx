import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/constants/theme';

export type CompleteButtonProps = {
  label?: string;
  completedLabel?: string;
  completed?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  /** Leading icon; defaults to a leaf glyph. */
  icon?: React.ReactNode;
  testID?: string;
};

/**
 * The hero "Complete Today" CTA (screen 4). Warm cream fill with a slow
 * breathing amber glow — deliberately soft rather than a saturated-green
 * button, so it reads as inviting rather than urgent. Glow settles once
 * `completed` is true.
 *
 * The glow is a dedicated static-shadow halo layer behind the button whose
 * *opacity* breathes, rather than animating shadowOpacity/shadowRadius
 * directly — the latter doesn't reliably render on React Native Web, while
 * opacity animates identically on iOS/Android/web. The button's own scale
 * pulse (a transform) is unaffected by this and stays on the button itself.
 */
export function CompleteButton({
  label = 'Complete Today',
  completedLabel = 'Completed Today',
  completed = false,
  onPress,
  disabled = false,
  icon,
  testID,
}: CompleteButtonProps) {
  const theme = useTheme();
  const breathe = useSharedValue(0);

  useEffect(() => {
    if (completed) {
      breathe.value = withTiming(0.4, { duration: 400 });
      return;
    }
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.4, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [completed]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: breathe.value,
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breathe.value * 0.01 }],
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={completed ? completedLabel : label}
      accessibilityHint={completed ? undefined : "Marks today's entry as complete"}
      accessibilityState={{ disabled }}
      testID={testID}
      style={({ pressed }) => [styles.wrapper, { opacity: disabled ? 0.5 : pressed ? 0.92 : 1 }]}
    >
      <Animated.View
        style={[
          glowStyle,
          styles.glowLayer,
          {
            borderRadius: theme.radii.full,
            backgroundColor: theme.colors.glowAmber,
            shadowColor: theme.colors.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 22,
            pointerEvents: 'none',
          },
        ]}
      />

      <Animated.View
        style={[
          styles.button,
          scaleStyle,
          {
            height: 56,
            borderRadius: theme.radii.full,
            paddingHorizontal: theme.spacing[6],
            backgroundColor: theme.colors.surfaceElevated,
          },
          theme.shadows.sm,
        ]}
      >
        <View style={{ marginRight: theme.spacing[2] }}>
          {icon ?? <Ionicons name="leaf" size={20} color={theme.colors.primary} />}
        </View>
        <Text style={[theme.typography.title, { color: theme.colors.textPrimary }]}>
          {completed ? completedLabel : label}
        </Text>
        <View
          style={[
            styles.checkCircle,
            {
              marginLeft: theme.spacing[2],
              backgroundColor: completed ? theme.colors.success : theme.colors.primaryMuted,
            },
          ]}
        >
          <Ionicons name="checkmark" size={14} color={completed ? theme.colors.textOnPrimary : theme.colors.primaryText} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowLayer: {
    position: 'absolute',
    top: -14,
    left: -14,
    right: -14,
    bottom: -14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CompleteButton;
