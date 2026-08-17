# Quiet Progress — Design System

Extracted from 4 source screens: **Today** (habit toggle list + weekly ring),
**This Week** (weekly overview + segmented progress), **Your Circles**
(accountability groups), **Habit Detail** (single-habit history + calendar
heatmap). Target stack: React Native / Expo, styled with plain `StyleSheet`
tokens today, NativeWind-ready if you add Tailwind later.

Companion files: [`constants/colors.ts`](./constants/colors.ts) ·
[`constants/theme.ts`](./constants/theme.ts)

The whole system reads as **"warm paper + quiet sage."** Nothing shouts: no
pure black, no pure white, no saturated brand color. Every state change
(toggle on, habit completed, streak hit) is communicated through a soft green
fill and a warm amber glow rather than color contrast alone — this is a
calm-tech habit app, and the palette is doing emotional work, not just
branding work.

---

## 1. Color Palette

### Base surfaces (warm paper system)

| Token | Hex | Usage |
|---|---|---|
| `background` | `#F5EFE4` | App background on every screen — warm ivory/paper, never pure white |
| `backgroundDeep` | `#EFE7D8` | Secondary background behind glow zones / sunken sections |
| `surface` | `#FBF7EE` | Card background — barely lighter than `background`, separated by shadow not contrast |
| `surfaceElevated` | `#FEFCF7` | Tab bar, floating circular buttons (back/more), CTA button base |
| `surfaceSunken` | `#EFE6D6` | Toggle-off track, empty progress segments, empty calendar cells |
| `border` | `#E9E0CF` | Hairline dividers (rare — most separation is shadow-based) |
| `borderDashed` | `#D8CBAE` | Empty-state dashed card ("No more circles yet") |

### Sage green — primary accent

The whole "growth" metaphor lives here: progress rings, filled bars, toggle-on
state, checkmarks, active tab indicator.

| Token | Hex | Usage |
|---|---|---|
| `sage-50` | `#F1F5EA` | rarely used, lightest tint |
| `sage-100` | `#E1EAD3` | icon-circle backgrounds, badge fill, progress-ring track |
| `sage-200` | `#CBDBB4` | — |
| `sage-300` | `#AFC891` | — |
| `sage-400` | `#93B473` | dark-mode primary (inferred) |
| **`sage-500`** | **`#7FA25E`** | **Primary** — progress ring fill, "Create Circle" button, filled bar-chart bars, active tab dot |
| `sage-600` | `#688A49` | toggle-on track, checkmark circles, pressed/active state |
| `sage-700` | `#52703A` | text color sitting on `sage-100` (e.g. "Daily" badge label) |
| `sage-800` | `#3D5A2A` | — |

### Amber / gold — glow & highlight accent

Used exclusively for *attention* moments: the mascot's aura, streak flame,
the "Complete Today" CTA glow, and the one highlighted cell in the calendar
heatmap. Never used for standard UI chrome — it's a sparingly-spent accent.

| Token | Hex | Usage |
|---|---|---|
| `amber-100` | `#FBEAC2` | streak-pill background |
| `amber-300` | `#F3CE7C` | glow gradient mid-stop |
| `amber-400` | `#EEBD55` | streak flame 🔥, calendar highlight cell |
| `amber-500` | `#E7A93A` | CTA glow core color |

### Text (warm ink, never pure black/gray)

| Token | Hex | Usage |
|---|---|---|
| `textPrimary` | `#2A2823` | Headings, big stat numbers |
| `textStrong` | `#4B473E` | Emphasized body (e.g. history "Completed") |
| `textSecondary` | `#857F70` | Subtitles, meta text ("3x this week", timestamps) |
| `textTertiary` | `#A39D8C` | Placeholder-weight text |
| `iconMuted` | `#C7C0AC` | Inactive tab icons, disabled glyphs |

### Semantic

| Token | Hex | Notes |
|---|---|---|
| `success` | `#688A49` (sage-600) | completed habit, checkmark |
| `warning` | `#EEBD55` (amber-400) | streak / highlight |
| `danger` | `#C4694F` | **inferred** — no error state appears in the 4 screens; kept in-family (muted terracotta) so it doesn't clash if you need one |
| `info` | `#7C93A8` | **inferred** — unused in source, dusty blue for future use |

> Only `background`, `surface`, `sage-*`, `amber-*`, and the ink/text scale
> are directly observed. `danger`/`info` are extrapolated to match the
> palette's warmth — swap them the moment a real error/info screen exists.

### Dark mode

**Not present in the source designs** — all 4 screens are light/paper only.
`constants/colors.ts` ships a reasonable dark variant (deep warm charcoal
background, same sage/amber accents desaturated slightly) purely so the
project's existing `useColorScheme()` plumbing keeps working. Treat it as a
placeholder, not an extraction — revisit once real dark comps exist.

---

## 2. Typography

Two-family system, doing two different jobs:

| Role | Family | Why |
|---|---|---|
| **Display** — screen-level hero titles: *"Today"*, *"This Week"*, *"Your Circles"*, *"Read 20 min"* | **Fraunces** (serif, 600/700) | Warm, slightly organic serif with soft curves — matches the mascot's rounded, hand-drawn character. Fallback: `Georgia` / iOS `ui-serif` ("New York"). |
| **UI / Sans** — card titles, numbers, buttons, labels, body | **Nunito** (400–800) | Rounded terminals, friendly, highly legible at small sizes. Fallback: system default. |

Big numeric stats (`5/7`, `4 / 7 days`) use the **sans** family at extra-bold
weight, not the serif — the serif is reserved for words, the sans for
numbers. This split is consistent across all 4 screens.

### Installing the fonts (Expo)

```bash
npx expo install expo-font @expo-google-fonts/fraunces @expo-google-fonts/nunito
```

```tsx
// app/_layout.tsx
import { useFonts, Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

const [fontsLoaded] = useFonts({
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
});
```

### Type scale

| Token | Family / Weight | Size / Line | Tracking | Example |
|---|---|---|---|---|
| `displayLg` | Fraunces 700 | 34 / 40 | -0.3 | "Today", "Read 20 min" |
| `display` | Fraunces 700 | 28 / 34 | -0.2 | "Your Circles" |
| `statXl` | Nunito 800 | 44 / 48 | -0.5 | "5/7" ring number |
| `statLg` | Nunito 800 | 32 / 38 | -0.3 | "4 / 7 days" |
| `title` | Nunito 700 | 17 / 22 | 0 | "Drink Water", "Family Pod" |
| `subtitle` | Nunito 400 | 13 / 18 | 0 | "3x this week", "Hydrate your body" |
| `body` | Nunito 400 | 15 / 20 | 0 | general copy |
| `labelCaps` | Nunito 700 | 11 / 14 | +1.2, uppercase | "HABITS THIS WEEK", "YOUR HABITS", "HABIT" |
| `button` | Nunito 700 | 15 / 20 | 0 | button labels |
| `caption` | Nunito 400 | 12 / 16 | 0 | timestamps ("9:12 AM", "Pending") |
| `tiny` | Nunito 600 | 10 / 12 | 0 | badge text |

All colors default to `textPrimary`; secondary/meta lines use `textSecondary`.

---

## 3. Spacing (4pt grid)

| Token | px | Usage |
|---|---|---|
| `1` | 4 | icon-to-label micro gaps |
| `2` | 8 | badge padding-y, tight stacks |
| `3` | 12 | gap between stacked cards, list-item icon↔text gap |
| `4` | 16 | card internal padding |
| `5` | 20 | **screen horizontal margin** (constant across all 4 screens) |
| `6` | 24 | gap between major sections |
| `8` | 32 | large section breathing room |
| `10`+ | 40+ | rare, empty-state vertical padding |

Semantic aliases (see `theme.layout`): `screenPaddingX`, `cardPaddingX/Y`,
`cardGap`, `sectionGap`, `listItemGap`.

---

## 4. Radii & Elevation

### Border radius

| Token | px | Usage |
|---|---|---|
| `sm` | 6 | bar-chart bars, calendar heatmap cells |
| `md` | 12 | small chips |
| `lg` | 20 | **cards** (the dominant radius in this app) |
| `xl` | 28 | tab bar container, hero CTA button, modals |
| `full` | 999 | pills, avatars, toggles, badges, all buttons except the tab bar |

Nothing in this UI uses a sharp (0px) or barely-rounded (4px) corner —
everything reads as soft and pillowy. When in doubt, round more.

### Shadows

All shadows are **warm-tinted** (`shadowColor: #2A2823`, never pure black)
and low-opacity — separation comes from softness, not darkness.

| Token | Offset | Opacity | Radius | Usage |
|---|---|---|---|---|
| `sm` | 0,1 | 0.06 | 3 | list-item icon circles, toggle knob |
| `md` | 0,4 | 0.08 | 12 | standard cards |
| `lg` | 0,8 | 0.10 | 20 | tab bar, FAB, header icon buttons |
| `glowAmber` | 0,0 | 0.45 | 24 | mascot aura, "Complete Today" CTA, streak highlight cell |
| `glowSage` | 0,0 | 0.35 | 16 | toggle-on pulse, completed-checkmark glow |

The amber/sage "glow" shadows are directional-less (0,0 offset) and wide —
implement as a soft radial halo, not a drop shadow.

---

## 5. Component Tokens

### Card (generic container)
`surface` bg · `radius.lg` (20) · `padding 16` · `shadow.sm` · no border by
default. Used for every habit row, circle card, and stat block.

### Icon Circle (leading icon in list rows)
44×44 · `radius.full` · bg `sage-100` · centered line icon in `textSecondary`
or `sage-700`. Seen on every habit/list row across screens 1, 2, 4.

### Toggle (habit complete switch — screen 1)
Track 52×32, `radius.full`.
- **Off**: bg `surfaceSunken`, 1px `border`, white knob (28×28) with `shadow.sm`.
- **On**: bg `sage-600`, white knob containing a small green checkmark glyph,
  track carries `shadow.glowSage` (soft green halo — visible on "Write &
  Reflect" in screen 1).

### Progress Ring (screen 1 "5/7 habits this week")
Circular, stroke width 14, round linecap. Track = `sage-100`, progress arc =
`sage-500`. Center: `statXl` number + `labelCaps` caption below.

### Segmented Progress Bar (screen 2, per-habit weekly bar)
7 pill segments, height 7, gap 4, `radius.full`. Filled = `sage-500`, empty =
`surfaceSunken`. One segment per day, left→right = Mon→Sun.

### Bar Chart (screen 4, "This Week" weekly reading minutes)
7 bars, width ~26, top corners `radius.sm`. Filled = `sage-500` at
proportional height, empty = `surfaceSunken` with 1px `border` outline. A
small dot marker in `amber-400` sits above the "attention" bar (e.g. today /
best day).

### Calendar Heatmap (screen 4, "This Month")
4×7 grid, cell 28×28, gap 4, `radius.sm`. States: empty = `surfaceSunken`,
completed = `sage-500`, **highlight** (best day / streak record) = `amber-400`
with `shadow.glowAmber` — this is the one cell that visually pulses out from
the grid.

### Buttons
- **Primary** (`buttonPrimary`, e.g. "Create Circle"): `sage-500` fill,
  white text, `radius.full`, height 52, `shadow.sm`.
- **Hero CTA** (`buttonHero`, "Complete Today"): *not* a flat primary fill —
  `surfaceElevated` (warm cream) base with a wide `shadow.glowAmber` halo,
  leading leaf icon + trailing green check-circle icon, height 56,
  `radius.full`. This is the app's single most important button and it's
  deliberately soft/warm rather than saturated-green, so it reads as inviting
  rather than urgent.
- **Header icon buttons** (back / "…" more): 40×40 circle, `surfaceElevated`
  bg, `shadow.sm`, dark icon glyph.
- **FAB** (screen 3, bottom-right "+"): white circle, dark plus glyph,
  `shadow.lg`, floats above the tab bar.

### Badges / Pills
`radius.full`, `sage-100` bg, `sage-700` text, `tiny`/`labelCaps` type,
paddingX 12 / paddingY 4. Used for "Daily" tag and the streak pill ("4 day
streak 🔥" — white/cream bg variant with a border instead of sage fill).

### Tab Bar
Floating card, `surfaceElevated` bg, `radius.xl` (28), height 68, `shadow.lg`,
positioned with margin above the safe area (not edge-to-edge). Inactive icons
`iconMuted`; active icon `sage-500` + a 4px solid dot beneath it — the dot,
not icon fill/bg change, is the sole active-state signal.

### List Item (habit row, member row, history row)
`flex-row`, `gap 12`, icon circle leading, title (`title`) + subtitle
(`subtitle`) stack, trailing control (toggle / stat text / status icon).
Rows are visually grouped inside a parent card, separated by internal
padding rather than dividers in most cases (screen 1); screen 4's history
list uses the same pattern with a checkmark-circle leading icon instead.

### Avatar (member photos, screen 3)
40×40 circle, 2px `surfaceElevated` border (so overlapping avatars separate
cleanly), overlap offset ≈ -10px in a stack.

---

## 6. Micro-interactions

Inferred from static states visible across the 4 screens (glow halos,
partially-filled elements, "just now" timestamps imply these, even though
the source is static):

- **Toggle on** — knob slides with a spring, track color crossfades
  sunken→sage-600, and a brief `glowSage` halo blooms and fades (visible as a
  lingering glow on the "Write & Reflect" toggle in screen 1 — the only one
  mid-glow, implying a just-fired completion pulse).
- **Habit/member checkmark** — fills and scale-bounces in (0 → 1.15 → 1) with
  a short `glowSage`/green pulse, not just a hard color swap.
- **Progress ring** — animates its arc sweep from 0 to current % on mount
  (don't render it pre-filled).
- **Segmented bars / bar chart** — bars grow from 0 to value on mount,
  staggered ~40ms per bar left→right.
- **"Complete Today" CTA** — carries a slow breathing glow loop (scale
  1 → 1.02, glow opacity 0.3 → 0.5, ~2.5s cycle) to draw the eye without
  being noisy; on tap, haptic + icon morph (leaf → check) + confetti-lite
  burst is a reasonable extension.
- **Mascot** — idle bob/breathe loop (translateY ±3px, ~3s) with a
  continuously soft-pulsing amber glow behind it — it's meant to feel alive,
  not static art.
- **Calendar highlight cell** — pulses its amber glow (opacity 0.3 → 0.6,
  ~2s loop) to flag a streak/record day among an otherwise static grid.
- **Card press** — scale to 0.97 + shadow softens slightly, standard
  tap-feedback; release springs back.
- **Tab switch** — active dot slides/fades to the new tab rather than
  popping; icon does a small scale-bounce (1 → 1.1 → 1) on select.

---

## 7. File Map

| File | Contains |
|---|---|
| `DESIGN_SYSTEM.md` | this document |
| `constants/colors.ts` | raw `sage`/`amber`/`ink`/`paper` scales + `lightColors`/`darkColors` semantic maps |
| `constants/theme.ts` | spacing, radii, typography, shadows, and per-component token objects (`theme.components.card`, `.toggleTrack`, `.progressRing`, etc.), exported via `createTheme(scheme)` |

```ts
import { theme } from '@/constants/theme';

<View style={theme.components.card}>
  <Text style={[theme.typography.title, { color: theme.colors.textPrimary }]}>
    Drink Water
  </Text>
</View>
```

### If/when you add NativeWind + Tailwind

Map the same tokens into `tailwind.config.js` so class-based styling stays in
sync with `theme.ts` (single source of truth = `constants/colors.ts`):

```js
// tailwind.config.js
const { sage, amber, ink, paper, line } = require('./constants/colors');

module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sage,
        amber,
        ink,
        paper,
        border: line.border,
        'border-dashed': line.borderDashed,
      },
      borderRadius: { xl2: '28px' },
      fontFamily: {
        display: ['Fraunces_700Bold'],
        sans: ['Nunito_400Regular'],
      },
    },
  },
  plugins: [],
};
```

Run `npx expo install nativewind tailwindcss react-native-css` and follow the
`expo:expo-tailwind-setup` skill for the Metro/Babel wiring.
