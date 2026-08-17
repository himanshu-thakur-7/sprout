import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/constants/theme';
import { IconCircle } from './IconCircle';
import { AvatarStack } from './Avatar';
import { CheckCircle } from './CheckCircle';
import { IconButton } from './IconButton';

export type CircleMember = {
  id: string;
  name: string;
  avatarUri?: string;
  done: boolean;
  /** e.g. "Just now", "9:12 AM", "Pending". */
  statusLabel: string;
};

export type CircleCardProps = {
  /** Leading glyph for the circle type, e.g. <Ionicons name="leaf-outline" .../>. */
  icon: React.ReactNode;
  title: string;
  /** e.g. "Private circle · 5 members". */
  subtitle: string;
  members: CircleMember[];
  liked?: boolean;
  onPressMenu?: () => void;
  onPressNudge?: () => void;
  onPressLike?: () => void;
  testID?: string;
};

/** An accountability-circle card (screen 3 "Your Circles") — avatar strip, member checklist, nudge action. */
export function CircleCard({
  icon,
  title,
  subtitle,
  members,
  liked,
  onPressMenu,
  onPressNudge,
  onPressLike,
  testID,
}: CircleCardProps) {
  const theme = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          padding: theme.spacing[4],
        },
        theme.shadows.sm,
      ]}
    >
      <View style={styles.headerRow}>
        <IconCircle size="sm" backgroundColor={theme.colors.surfaceSunken}>
          {icon}
        </IconCircle>
        <View style={[styles.textStack, { marginLeft: theme.spacing[3] }]}>
          <Text style={[theme.typography.title, { color: theme.colors.textPrimary }]}>{title}</Text>
          <Text style={[theme.typography.subtitle, { color: theme.colors.textSecondary, marginTop: 2 }]}>
            {subtitle}
          </Text>
        </View>
        {onPressMenu && (
          <IconButton variant="plain" accessibilityLabel={`More options for ${title}`} onPress={onPressMenu}>
            <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textSecondary} />
          </IconButton>
        )}
      </View>

      <View style={{ marginTop: theme.spacing[3] }}>
        <AvatarStack members={members.map((m) => ({ id: m.id, name: m.name, uri: m.avatarUri }))} />
      </View>

      <View style={{ marginTop: theme.spacing[3] }}>
        {members.map((member) => (
          <View key={member.id} style={[styles.memberRow, { paddingVertical: theme.spacing[1] }]}>
            <CheckCircle
              checked={member.done}
              accessibilityLabel={`${member.name} — ${member.done ? 'completed' : 'pending'}`}
            />
            <Text
              style={[
                theme.typography.body,
                { color: theme.colors.textPrimary, marginLeft: theme.spacing[2], flex: 1 },
              ]}
            >
              {member.name}
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              {member.statusLabel}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.footerRow, { marginTop: theme.spacing[3] }]}>
        {onPressNudge && (
          <Pressable
            onPress={onPressNudge}
            accessibilityRole="button"
            accessibilityLabel={`Nudge ${title}`}
            style={({ pressed }) => [
              styles.nudgeButton,
              {
                borderRadius: theme.radii.full,
                paddingHorizontal: theme.spacing[4],
                paddingVertical: theme.spacing[2],
                backgroundColor: theme.colors.primaryMuted,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Ionicons name="heart-outline" size={14} color={theme.colors.primaryText} />
            <Text style={[theme.typography.button, { color: theme.colors.primaryText, marginLeft: 6, fontSize: 14 }]}>
              Nudge
            </Text>
          </Pressable>
        )}

        <View style={{ flex: 1 }} />

        {onPressLike && (
          <IconButton
            variant="plain"
            accessibilityLabel={liked ? `Unlike ${title}` : `Like ${title}`}
            accessibilityHint="Double tap to toggle"
            onPress={onPressLike}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={20}
              color={liked ? theme.colors.success : theme.colors.textSecondary}
            />
          </IconButton>
        )}
      </View>
    </View>
  );
}

export type CircleCardEmptyProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onPressCta?: () => void;
};

/** Empty-state card ("No more circles yet") shown at the end of the circles list. */
export function CircleCardEmpty({
  title = 'No more circles yet',
  subtitle = 'Create a new circle or invite others to share your quiet progress.',
  ctaLabel = 'Create Circle',
  onPressCta,
}: CircleCardEmptyProps) {
  const theme = useTheme();

  return (
    <View style={theme.components.cardEmptyState}>
      <Ionicons name="people-outline" size={28} color={theme.colors.textTertiary} />
      <Text
        style={[theme.typography.title, { color: theme.colors.textPrimary, marginTop: theme.spacing[3] }]}
      >
        {title}
      </Text>
      <Text
        style={[
          theme.typography.subtitle,
          { color: theme.colors.textSecondary, marginTop: theme.spacing[1], textAlign: 'center' },
        ]}
      >
        {subtitle}
      </Text>
      {onPressCta && (
        <Pressable
          onPress={onPressCta}
          accessibilityRole="button"
          accessibilityLabel={ctaLabel}
          style={({ pressed }) => [
            styles.ctaButton,
            {
              marginTop: theme.spacing[4],
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radii.full,
              paddingHorizontal: theme.spacing[5],
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Ionicons name="add" size={16} color={theme.colors.textOnPrimary} />
          <Text style={[theme.typography.button, { color: theme.colors.textOnPrimary, marginLeft: 6 }]}>
            {ctaLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStack: {
    flex: 1,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nudgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
  },
});

export default CircleCard;
