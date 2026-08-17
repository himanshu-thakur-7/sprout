import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/constants/theme';
import { useTodayHabits } from '@/data';
import { Header, MascotGlow, ProgressRing, HabitCard, ScreenContainer } from '@/components/ui';

/** "Today" — screen 1: weekly ring + one-tap habit toggles, backed by the local data store. */
export default function TodayScreen() {
  const theme = useTheme();
  const { items, weeklyStats, toggleHabitToday } = useTodayHabits();

  return (
    <>
      <StatusBar style="dark" />
      <ScreenContainer testID="today-screen">
        <Header layout="row" leading={<MascotGlow size="sm" />} title="Today" />

        <View style={{ alignItems: 'center', marginTop: theme.spacing[6], marginBottom: theme.spacing[6] }}>
          <ProgressRing
            progress={weeklyStats.total ? weeklyStats.done / weeklyStats.total : 0}
            valueLabel={`${weeklyStats.done}/${weeklyStats.total}`}
            caption="HABITS THIS WEEK"
          />
        </View>

        <View style={{ gap: theme.layout.cardGap }}>
          {items.map(({ habit, doneToday }) => (
            <HabitCard
              key={habit.id}
              icon={<Ionicons name={habit.icon} size={20} color={theme.colors.primaryText} />}
              title={habit.title}
              subtitle={habit.frequencyLabel}
              completed={doneToday}
              onToggle={() => toggleHabitToday(habit.id)}
              onPress={() => router.push({ pathname: '/habit/[id]', params: { id: habit.id } })}
            />
          ))}
        </View>
      </ScreenContainer>
    </>
  );
}
