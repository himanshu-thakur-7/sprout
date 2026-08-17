import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/theme';

export type AvatarProps = {
  uri?: string;
  /** Shown when `uri` is absent — first letter of the person's name. */
  name: string;
  size?: number;
  /** Overlap ring color; defaults to the surface it sits on (surfaceElevated). */
  borderColor?: string;
  style?: { marginLeft?: number };
};

export function Avatar({ uri, name, size = 40, borderColor, style }: AvatarProps) {
  const theme = useTheme();
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <View
      accessible
      accessibilityLabel={name}
      style={[
        {
          width: size,
          height: size,
          borderRadius: theme.radii.full,
          borderWidth: 2,
          borderColor: borderColor ?? theme.colors.surfaceElevated,
          backgroundColor: theme.colors.primaryMuted,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} accessibilityIgnoresInvertColors />
      ) : (
        <Text style={{ color: theme.colors.primaryText, fontFamily: theme.fontFamily.sansBold, fontSize: size * 0.4 }}>
          {initial}
        </Text>
      )}
    </View>
  );
}

export type AvatarStackProps = {
  members: { id: string; name: string; uri?: string }[];
  size?: number;
  /** How many avatars to show before collapsing the rest into a "+N" bubble. */
  max?: number;
};

/** Overlapping avatar row — the member-photo strip on each circle card (screen 3). */
export function AvatarStack({ members, size = 40, max = 6 }: AvatarStackProps) {
  const theme = useTheme();
  const visible = members.slice(0, max);
  const overflow = members.length - visible.length;

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${members.length} member${members.length === 1 ? '' : 's'}: ${members
        .map((m) => m.name)
        .join(', ')}`}
    >
      {visible.map((member, index) => (
        <Avatar
          key={member.id}
          uri={member.uri}
          name={member.name}
          size={size}
          style={{ marginLeft: index === 0 ? 0 : -size * 0.28 }}
        />
      ))}
      {overflow > 0 && (
        <View
          style={[
            styles.overflow,
            {
              width: size,
              height: size,
              borderRadius: theme.radii.full,
              marginLeft: -size * 0.28,
              backgroundColor: theme.colors.surfaceSunken,
              borderColor: theme.colors.surfaceElevated,
            },
          ]}
        >
          <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.sansBold, fontSize: size * 0.32 }}>
            +{overflow}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overflow: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});

export default Avatar;
