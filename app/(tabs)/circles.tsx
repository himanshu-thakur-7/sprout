import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/constants/theme';
import { useData } from '@/data';
import { Header, Avatar, IconButton, CircleCard, CircleCardEmpty } from '@/components/ui';

/** "Your Circles" — screen 3: accountability groups + empty-state CTA + FAB. */
export default function YourCirclesScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { circles, toggleCircleLiked } = useData();

  // Ephemeral UI-only state — not persisted, unlike everything from useData().
  const [hasUnread, setHasUnread] = useState(true);

  const sendNudge = (title: string) => {
    Alert.alert('Nudge sent', `${title} was nudged to keep up their streak.`);
  };

  return (
    <>
      <StatusBar style="dark" />
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: insets.top + theme.spacing[3],
            paddingHorizontal: theme.layout.screenPaddingX,
            paddingBottom: theme.layout.tabBarHeight + insets.bottom + theme.spacing[10],
          }}
        >
          <Header
            layout="row"
            leading={<Avatar name="Me" size={40} />}
            title="Your Circles"
            trailing={
              <IconButton
                accessibilityLabel={hasUnread ? 'Notifications, unread' : 'Notifications'}
                showBadge={hasUnread}
                onPress={() => setHasUnread(false)}
              >
                <Ionicons name="notifications-outline" size={20} color={theme.colors.textPrimary} />
              </IconButton>
            }
          />

          <View style={{ gap: theme.layout.cardGap, marginTop: theme.spacing[6] }}>
            {circles.map((circle) => (
              <CircleCard
                key={circle.id}
                icon={<Ionicons name={circle.icon} size={18} color={theme.colors.primaryText} />}
                title={circle.title}
                subtitle={circle.memberCountLabel}
                members={circle.members}
                liked={circle.liked}
                onPressLike={() => toggleCircleLiked(circle.id)}
                onPressNudge={() => sendNudge(circle.title)}
                onPressMenu={() => Alert.alert(circle.title, 'More options coming soon.')}
              />
            ))}

            <CircleCardEmpty onPressCta={() => router.push('/modal')} />
          </View>
        </ScrollView>

        <IconButton
          variant="fab"
          accessibilityLabel="Create a new circle"
          onPress={() => router.push('/modal')}
          style={{
            position: 'absolute',
            right: theme.layout.screenPaddingX,
            bottom: theme.layout.tabBarHeight + insets.bottom + theme.spacing[3],
          }}
        >
          <Ionicons name="add" size={26} color={theme.colors.textPrimary} />
        </IconButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
