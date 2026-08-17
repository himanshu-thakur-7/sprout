/**
 * Quiet Progress — Design System Theme
 * Drop-in token file for React Native / Expo (StyleSheet or NativeWind-friendly).
 * Pair with ../DESIGN_SYSTEM.md for full documentation and screen references.
 *
 * Usage:
 *   import { theme } from '@/constants/theme';
 *   const styles = StyleSheet.create({
 *     card: {
 *       backgroundColor: theme.colors.surface,
 *       borderRadius: theme.radii.lg,
 *       padding: theme.spacing[4],
 *       ...theme.shadows.md,
 *     },
 *   });
 */
import { useMemo } from 'react';
import { colors, ColorScheme } from './colors';
import { useColorScheme } from '@/components/useColorScheme';

// ---------------------------------------------------------------------------
// Spacing — 4pt grid, Tailwind-numbered
// ---------------------------------------------------------------------------

export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

// Common semantic aliases used across the source screens
export const layout = {
  screenPaddingX: spacing[5], // 20 — outer horizontal margin on every screen
  cardPaddingX: spacing[4], // 16
  cardPaddingY: spacing[4], // 16
  cardGap: spacing[3], // 12 — vertical gap between stacked cards
  sectionGap: spacing[6], // 24 — gap between major sections
  listItemGap: spacing[3], // 12 — icon-to-text gap in list rows
  tabBarHeight: 68,
  iconCircleSize: 44,
  avatarSize: 40,
} as const;

// ---------------------------------------------------------------------------
// Radii
// ---------------------------------------------------------------------------

export const radii = {
  none: 0,
  sm: 6, // bar-chart bars, calendar heatmap cells
  md: 12, // small chips, inputs
  lg: 20, // cards
  xl: 28, // tab bar container, big CTA button, modals
  full: 999, // pills, avatars, toggles, badges, buttons
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

/**
 * Two-family system:
 *  - display (serif): screen-level hero headings ("Today", "Read 20 min").
 *    Recommended: Fraunces (Google Fonts, variable) — warm/organic serif
 *    that matches the mascot's soft, rounded character. Fallback: Georgia
 *    / ui-serif (iOS "New York").
 *  - sans (rounded UI face): everything else — card titles, numbers,
 *    buttons, labels. Recommended: Nunito. Fallback: system default.
 *
 * Install via @expo-google-fonts/fraunces + @expo-google-fonts/nunito and
 * load with expo-font in the app root before rendering (see DESIGN_SYSTEM.md
 * "Fonts" section for the exact loadAsync call).
 */
export const fontFamily = {
  display: 'Fraunces_700Bold',
  displaySemibold: 'Fraunces_600SemiBold',
  sans: 'Nunito_400Regular',
  sansMedium: 'Nunito_500Medium',
  sansSemibold: 'Nunito_600SemiBold',
  sansBold: 'Nunito_700Bold',
  sansExtraBold: 'Nunito_800ExtraBold',
} as const;

export const typography = {
  // Page-level hero title — "Today", "This Week", "Your Circles", "Read 20 min"
  displayLg: {
    fontFamily: fontFamily.display,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  display: {
    fontFamily: fontFamily.display,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.2,
  },
  // Big numeric stats — ring "5/7", detail "4 / 7 days"
  statXl: {
    fontFamily: fontFamily.sansExtraBold,
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  statLg: {
    fontFamily: fontFamily.sansExtraBold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.3,
  },
  // Card / list-item titles — "Drink Water", "Family Pod"
  title: {
    fontFamily: fontFamily.sansBold,
    fontSize: 17,
    lineHeight: 22,
  },
  // Card / list-item subtitles — "3x this week", "Hydrate your body"
  subtitle: {
    fontFamily: fontFamily.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  body: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
    lineHeight: 20,
  },
  // Uppercase section labels — "HABITS THIS WEEK", "YOUR HABITS", "HABIT"
  labelCaps: {
    fontFamily: fontFamily.sansBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: fontFamily.sansBold,
    fontSize: 15,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    lineHeight: 16,
  },
  tiny: {
    fontFamily: fontFamily.sansSemibold,
    fontSize: 10,
    lineHeight: 12,
  },
} as const;

// ---------------------------------------------------------------------------
// Shadows / elevation — soft, warm-tinted (never pure black)
// ---------------------------------------------------------------------------

export const shadows = {
  none: {},
  sm: {
    shadowColor: '#2A2823',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#2A2823',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: '#2A2823',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  glowAmber: {
    shadowColor: '#EEBD55',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 8,
  },
  glowSage: {
    shadowColor: '#7FA25E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

// ---------------------------------------------------------------------------
// Component tokens — one object per recurring UI pattern in the source screens
// ---------------------------------------------------------------------------

export function buildComponents(scheme: ColorScheme) {
  const c = colors[scheme];

  return {
    card: {
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      paddingHorizontal: layout.cardPaddingX,
      paddingVertical: layout.cardPaddingY,
      ...shadows.sm,
    },
    cardEmptyState: {
      backgroundColor: 'transparent',
      borderRadius: radii.lg,
      borderWidth: 1.5,
      borderStyle: 'dashed' as const,
      borderColor: c.borderDashed,
      paddingHorizontal: layout.cardPaddingX,
      paddingVertical: spacing[6],
      alignItems: 'center' as const,
    },
    iconCircle: {
      width: layout.iconCircleSize,
      height: layout.iconCircleSize,
      borderRadius: radii.full,
      backgroundColor: c.primaryMuted,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    avatar: {
      width: layout.avatarSize,
      height: layout.avatarSize,
      borderRadius: radii.full,
      borderWidth: 2,
      borderColor: c.surfaceElevated,
    },
    buttonPrimary: {
      backgroundColor: c.primary,
      borderRadius: radii.full,
      height: 52,
      paddingHorizontal: spacing[5],
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...shadows.sm,
    },
    buttonPrimaryText: {
      ...typography.button,
      color: c.textOnPrimary,
    },
    // The hero "Complete Today" CTA — warm surface + amber glow, not a flat
    // primary-color fill like buttonPrimary.
    buttonHero: {
      backgroundColor: c.surfaceElevated,
      borderRadius: radii.full,
      height: 56,
      paddingHorizontal: spacing[6],
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: spacing[2],
      ...shadows.glowAmber,
    },
    badge: {
      backgroundColor: c.primaryMuted,
      borderRadius: radii.full,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
      alignSelf: 'flex-start' as const,
    },
    badgeText: {
      ...typography.tiny,
      color: c.primaryText,
    },
    toggleTrack: {
      width: 52,
      height: 32,
      borderRadius: radii.full,
      padding: 2,
      justifyContent: 'center' as const,
    },
    toggleTrackOff: {
      backgroundColor: c.surfaceSunken,
      borderWidth: 1,
      borderColor: c.border,
    },
    toggleTrackOn: {
      backgroundColor: c.primary,
      ...shadows.glowSage,
    },
    toggleKnob: {
      width: 28,
      height: 28,
      borderRadius: radii.full,
      backgroundColor: '#FFFFFF',
      ...shadows.sm,
    },
    progressRing: {
      strokeWidth: 14,
      trackColor: c.primaryMuted,
      progressColor: c.primary,
      strokeLinecap: 'round' as const,
    },
    progressSegmented: {
      segmentHeight: 7,
      segmentGap: spacing[1],
      radius: radii.full,
      filledColor: c.primary,
      emptyColor: c.surfaceSunken,
    },
    barChart: {
      barWidth: 26,
      radiusTop: radii.sm,
      filledColor: c.primary,
      emptyColor: c.surfaceSunken,
      emptyBorderColor: c.border,
      markerColor: c.accent,
    },
    calendarHeatmapCell: {
      size: 28,
      gap: spacing[1],
      radius: radii.sm,
      empty: c.surfaceSunken,
      filled: c.primary,
      highlight: c.accent,
      highlightGlow: c.glowAmber,
    },
    tabBar: {
      backgroundColor: c.surfaceElevated,
      borderRadius: radii.xl,
      height: layout.tabBarHeight,
      ...shadows.lg,
    },
    tabIconActive: c.primary,
    tabIconInactive: c.iconMuted,
    tabActiveDotSize: 4,
    headerIconButton: {
      width: 40,
      height: 40,
      borderRadius: radii.full,
      backgroundColor: c.surfaceElevated,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...shadows.sm,
    },
    mascotGlow: {
      ...shadows.glowAmber,
    },
    listItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: layout.listItemGap,
      paddingVertical: spacing[2],
    },
    divider: {
      height: 1,
      backgroundColor: c.border,
    },
  };
}

// ---------------------------------------------------------------------------
// Public theme factory
// ---------------------------------------------------------------------------

export function createTheme(scheme: ColorScheme = 'light') {
  return {
    scheme,
    colors: colors[scheme],
    spacing,
    layout,
    radii,
    typography,
    fontFamily,
    shadows,
    components: buildComponents(scheme),
  };
}

export const theme = createTheme('light');
export type Theme = ReturnType<typeof createTheme>;

/** Live theme bound to the device color scheme. Use this from components
 * instead of the static `theme` export so light/dark switching works. */
export function useTheme(): Theme {
  const scheme = useColorScheme();
  return useMemo(() => createTheme(scheme as ColorScheme), [scheme]);
}

export default theme;
