import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/constants/theme';
import { DAY_LABELS } from '@/lib/date';
import { useWeekOverview } from '@/data';
import { Header, MascotGlow, HabitCard, WeeklyProgressBar, ScreenContainer } from '@/components/ui';

/** "This Week" — screen 2: day strip + per-habit weekly progress, derived from real completions. */
export default function ThisWeekScreen() {
  const theme = useTheme();
  const { items, weekActivity, percentComplete } = useWeekOverview();
  const activeDays = weekActivity.filter(Boolean).length;

  return (
    <>
      <StatusBar style="dark" />
      <ScreenContainer testID="week-screen">
        <Header layout="split" title="This Week" subtitle="Weekly Overview" leading={<MascotGlow size="lg" />} />

        <WeekDayStrip weekActivity={weekActivity} />

        <View style={[styles.sectionHeader, { marginTop: theme.spacing[6], marginBottom: theme.spacing[3] }]}>
          <Text style={[theme.typography.labelCaps, { color: theme.colors.textTertiary }]}>YOUR HABITS</Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>{activeDays} of 7 days</Text>
        </View>

        <View style={{ gap: theme.layout.cardGap }}>
          {items.map(({ habit, weekCount }) => (
            <HabitCard
              key={habit.id}
              icon={<Ionicons name={habit.icon} size={20} color={theme.colors.primaryText} />}
              title={habit.title}
              subtitle={habit.description}
              onPress={() => router.push({ pathname: '/habit/[id]', params: { id: habit.id } })}
              trailing={
                <Text style={[theme.typography.title, { color: theme.colors.textSecondary, fontSize: 15 }]}>
                  {weekCount} of 7
                </Text>
              }
              footer={<WeeklyProgressBar filled={weekCount} accessibilityLabel={`${habit.title} weekly progress`} />}
            />
          ))}

          <QuietProgressCard percent={percentComplete} />
        </View>
      </ScreenContainer>
    </>
  );
}

function WeekDayStrip({ weekActivity }: { weekActivity: boolean[] }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.dayStrip,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          paddingVertical: theme.spacing[4],
          marginTop: theme.spacing[5],
        },
        theme.shadows.sm,
      ]}
      accessible
      accessibilityLabel="This week's activity by day"
    >
      {DAY_LABELS.map((label, index) => {
        const active = weekActivity[index];
        return (
          <View key={label} style={styles.dayColumn}>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>{label}</Text>
            <View
              style={[
                styles.dayDot,
                {
                  marginTop: theme.spacing[2],
                  backgroundColor: active ? theme.colors.primary : theme.colors.surfaceSunken,
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

function QuietProgressCard({ percent }: { percent: number }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.quietCard,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          padding: theme.spacing[4],
        },
        theme.shadows.sm,
      ]}
    >
      <View
        style={[
          styles.quietIcon,
          { backgroundColor: theme.colors.primaryMuted, borderRadius: theme.radii.full, marginRight: theme.spacing[3] },
        ]}
      >
        <Ionicons name="leaf-outline" size={18} color={theme.colors.primaryText} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={theme.typography.title}>
          <Text style={{ color: theme.colors.textPrimary }}>Quiet progress — </Text>
          <Text style={{ color: theme.colors.primaryText }}>you're {percent}% there</Text>
        </Text>
        <Text style={[theme.typography.subtitle, { color: theme.colors.textSecondary, marginTop: 2 }]}>
          Small steps. Real change. Keep going.
        </Text>
      </View>

      <View style={[styles.quietAccentBar, { backgroundColor: theme.colors.primaryMuted }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quietCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quietIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quietAccentBar: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginLeft: 8,
  },
});
