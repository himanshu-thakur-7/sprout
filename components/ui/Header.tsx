import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/constants/theme';

export type HeaderProps = {
  /** Small caps eyebrow above the title, e.g. "HABIT" (detail screen). */
  eyebrow?: string;
  title: string;
  /** Secondary line under the title, e.g. "Weekly Overview". */
  subtitle?: string;
  /**
   * Content left of the title — a <MascotGlow size="sm"/>, an <Avatar/>,
   * or an <IconButton> back button. Left empty on screens with no leading
   * element.
   */
  leading?: React.ReactNode;
  /** Content right of the title — a bell <IconButton>, a "…" more button. */
  trailing?: React.ReactNode;
  /** Content under the title, e.g. a <Badge label="Daily"/> frequency tag. */
  meta?: React.ReactNode;
  /**
   * 'row' — leading + title side by side, left-aligned (screens 1 & 3).
   * 'split' — title/subtitle stacked left, leading (mascot) floats right (screen 2).
   * 'center' — back button + trailing on the edges, everything else centered (screen 4 detail).
   */
  layout?: 'row' | 'split' | 'center';
};

/**
 * Screen-level header. One flexible shell instead of four bespoke
 * components — compose it with MascotGlow / Avatar / IconButton / Badge to
 * reproduce any of the four header styles in the source screens:
 *
 *   <Header layout="row" leading={<MascotGlow size="sm" />} title="Today" />
 *
 *   <Header layout="split" title="This Week" subtitle="Weekly Overview"
 *           leading={<MascotGlow size="lg" />} />
 *
 *   <Header layout="row" leading={<Avatar name="Me" size={40} />}
 *           title="Your Circles"
 *           trailing={<IconButton accessibilityLabel="Notifications" showBadge>…</IconButton>} />
 *
 *   <Header layout="center" eyebrow="HABIT" title="Read 20 min"
 *           meta={<Badge label="Daily" />}
 *           leading={<IconButton accessibilityLabel="Back">…</IconButton>}
 *           trailing={<IconButton accessibilityLabel="More">…</IconButton>} />
 */
export function Header({ eyebrow, title, subtitle, leading, trailing, meta, layout = 'row' }: HeaderProps) {
  const theme = useTheme();

  const titleBlock = (
    <View style={layout === 'center' ? styles.centerText : undefined}>
      {eyebrow && (
        <Text
          style={[
            theme.typography.labelCaps,
            { color: theme.colors.textTertiary, textAlign: layout === 'center' ? 'center' : 'left' },
          ]}
        >
          {eyebrow}
        </Text>
      )}
      <Text
        style={[
          theme.typography.displayLg,
          {
            color: theme.colors.textPrimary,
            marginTop: eyebrow ? theme.spacing[1] : 0,
            textAlign: layout === 'center' ? 'center' : 'left',
          },
        ]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={[
            theme.typography.body,
            {
              color: theme.colors.textSecondary,
              marginTop: theme.spacing[1],
              textAlign: layout === 'center' ? 'center' : 'left',
            },
          ]}
        >
          {subtitle}
        </Text>
      )}
      {meta && <View style={{ marginTop: theme.spacing[2], alignItems: layout === 'center' ? 'center' : 'flex-start' }}>{meta}</View>}
    </View>
  );

  if (layout === 'split') {
    return (
      <View style={styles.splitRow}>
        <View style={{ flex: 1 }}>{titleBlock}</View>
        {leading}
      </View>
    );
  }

  if (layout === 'center') {
    return (
      <View style={styles.centerRow}>
        <View style={styles.edgeSlot}>{leading}</View>
        <View style={styles.centerSlot}>{titleBlock}</View>
        <View style={[styles.edgeSlot, styles.edgeSlotRight]}>{trailing}</View>
      </View>
    );
  }

  // 'row' (default)
  return (
    <View style={styles.row}>
      {leading && <View style={{ marginRight: theme.spacing[3] }}>{leading}</View>}
      <View style={{ flex: 1 }}>{titleBlock}</View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
  },
  centerText: {
    alignItems: 'center',
  },
  edgeSlot: {
    width: 40,
    alignItems: 'flex-start',
  },
  edgeSlotRight: {
    alignItems: 'flex-end',
  },
});

export default Header;
