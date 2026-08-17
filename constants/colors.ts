/**
 * Quiet Progress — Color Palette
 * Extracted from the 4 source screens (Today, This Week, Your Circles, Habit Detail).
 * Warm paper background + soft sage green accent system.
 *
 * Naming: Tailwind-style numeric scales (50 light → 900 dark) for the two
 * brand hues (sage, amber), plus flat semantic tokens for everything else.
 * See ../DESIGN_SYSTEM.md for the full rationale and per-component usage.
 */

// ---------------------------------------------------------------------------
// Raw scales
// ---------------------------------------------------------------------------

export const sage = {
  50: '#F1F5EA',
  100: '#E1EAD3',
  200: '#CBDBB4',
  300: '#AFC891',
  400: '#93B473',
  500: '#7FA25E', // primary — buttons, active tab dot, filled progress
  600: '#688A49', // toggle-on track, checkmarks, pressed state
  700: '#52703A', // text-on-sage (badge labels)
  800: '#3D5A2A',
} as const;

export const amber = {
  100: '#FBEAC2',
  300: '#F3CE7C',
  400: '#EEBD55', // streak flame, calendar highlight cell
  500: '#E7A93A', // CTA glow core
} as const;

export const ink = {
  // warm charcoal neutrals — never pure black/gray
  900: '#2A2823', // text-primary
  700: '#4B473E', // text-strong / body emphasis
  500: '#857F70', // text-secondary
  400: '#A39D8C', // text-tertiary / placeholder
  300: '#C7C0AC', // inactive icon / disabled
} as const;

export const paper = {
  base: '#F5EFE4', // app background
  deep: '#EFE7D8', // secondary background (behind glows, sunken areas)
  surface: '#FBF7EE', // card surface
  surfaceElevated: '#FEFCF7', // tab bar, floating buttons, modals
  surfaceSunken: '#EFE6D6', // toggle-off track, empty bar/cell fill
} as const;

export const line = {
  border: '#E9E0CF', // hairline card border / divider
  borderDashed: '#D8CBAE', // dashed empty-state border
} as const;

// ---------------------------------------------------------------------------
// Semantic tokens (light theme — matches the source screens 1:1)
// ---------------------------------------------------------------------------

export const lightColors = {
  // surfaces
  background: paper.base,
  backgroundDeep: paper.deep,
  surface: paper.surface,
  surfaceElevated: paper.surfaceElevated,
  surfaceSunken: paper.surfaceSunken,

  // borders
  border: line.border,
  borderDashed: line.borderDashed,

  // brand
  primary: sage[500],
  primaryPressed: sage[600],
  primaryMuted: sage[100],
  primaryText: sage[700], // text sitting on primaryMuted (e.g. "Daily" badge)
  accent: amber[400],
  accentMuted: amber[100],
  glowAmber: 'rgba(238,189,85,0.35)',
  glowSage: 'rgba(127,162,94,0.30)',

  // text
  textPrimary: ink[900],
  textStrong: ink[700],
  textSecondary: ink[500],
  textTertiary: ink[400],
  iconMuted: ink[300],
  textOnPrimary: '#FFFFFF',

  // semantic status
  success: sage[600],
  successMuted: sage[100],
  warning: amber[400],
  warningMuted: amber[100],
  danger: '#C4694F', // inferred — not present in source screens, kept in-palette
  dangerMuted: '#F3DCD3',
  info: '#7C93A8', // inferred — unused in source screens

  // overlays
  scrim: 'rgba(42,40,35,0.35)',
} as const;

// ---------------------------------------------------------------------------
// Dark theme — INFERRED, not present in the source screens (all 4 shots are
// light/paper only). Provided so the existing useColorScheme() plumbing in
// this project keeps working; revisit once real dark-mode comps exist.
// ---------------------------------------------------------------------------

export const darkColors = {
  background: '#1E1C18',
  backgroundDeep: '#161511',
  surface: '#28251F',
  surfaceElevated: '#302C25',
  surfaceSunken: '#211F1A',

  border: '#3A362C',
  borderDashed: '#4A4536',

  primary: sage[400],
  primaryPressed: sage[300],
  primaryMuted: '#2E3B23',
  primaryText: sage[300],
  accent: amber[400],
  accentMuted: '#3B321C',
  glowAmber: 'rgba(238,189,85,0.25)',
  glowSage: 'rgba(147,180,115,0.25)',

  textPrimary: '#F2EDE1',
  textStrong: '#D9D2C2',
  textSecondary: '#A79F8C',
  textTertiary: '#7C7566',
  iconMuted: '#5C5748',
  textOnPrimary: '#1E1C18',

  success: sage[400],
  successMuted: '#2E3B23',
  warning: amber[400],
  warningMuted: '#3B321C',
  danger: '#D98267',
  dangerMuted: '#3E2A22',
  info: '#93AABE',

  scrim: 'rgba(0,0,0,0.5)',
} as const;

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = { [K in keyof typeof lightColors]: string };

export const colors: Record<ColorScheme, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};

export default colors;
