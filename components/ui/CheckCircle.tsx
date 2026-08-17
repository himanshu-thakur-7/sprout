import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/constants/theme';

export type CheckCircleProps = {
  checked: boolean;
  size?: number;
  /** Announced by screen readers, e.g. "Anna — completed" / "Leo — pending". */
  accessibilityLabel?: string;
};

/**
 * Small status indicator used in circle-member rows and habit history rows:
 * a filled sage circle with a checkmark when done, a hollow outline ring
 * when pending. Pops with a short scale-bounce whenever it flips to checked.
 */
export function CheckCircle({ checked, size = 22, accessibilityLabel }: CheckCircleProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (checked) {
      scale.value = withSequence(
        withTiming(1.2, { duration: 120, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 140, easing: Easing.out(Easing.ease) })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      accessibilityLabel={accessibilityLabel}
      style={[
        animatedStyle,
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: theme.radii.full,
          backgroundColor: checked ? theme.colors.success : 'transparent',
          borderWidth: checked ? 0 : 1.5,
          borderColor: theme.colors.iconMuted,
        },
      ]}
    >
      {checked && <Ionicons name="checkmark" size={size * 0.65} color={theme.colors.textOnPrimary} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CheckCircle;
