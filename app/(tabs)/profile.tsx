import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/constants/theme';
import { Header, MascotGlow, ScreenContainer } from '@/components/ui';

/**
 * Profile — not one of the four pixel-matched source screens; a minimal
 * placeholder so the 4th tab in the source screen's tab bar has a real
 * destination instead of a dead link.
 */
export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <>
      <StatusBar style="dark" />
      <ScreenContainer testID="profile-screen">
        <Header layout="row" leading={<MascotGlow size="sm" animated={false} />} title="Profile" />

        <View style={{ alignItems: 'center', marginTop: theme.spacing[10] }}>
          <MascotGlow size="lg" />
          <Text
            style={[
              theme.typography.title,
              { color: theme.colors.textSecondary, marginTop: theme.spacing[4], textAlign: 'center' },
            ]}
          >
            Coming soon
          </Text>
          <Text
            style={[
              theme.typography.subtitle,
              { color: theme.colors.textTertiary, marginTop: theme.spacing[1], textAlign: 'center' },
            ]}
          >
            Your profile, settings, and account details will live here.
          </Text>
        </View>
      </ScreenContainer>
    </>
  );
}
