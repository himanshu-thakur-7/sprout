import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/constants/theme';
import { useHabitDetail } from '@/data';
import {
  Header,
  IconButton,
  Badge,
  WeeklyBarChart,
  CalendarHeatmap,
  MascotGlow,
  CompleteButton,
  HistoryRow,
  ScreenContainer,
} from '@/components/ui';

/** Habit detail — screen 4: weekly chart, monthly heatmap, complete CTA, history. All derived live from the store. */
export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const detail = useHabitDetail(id);

  if (!detail) {
    // Unknown/removed habit id — bounce back rather than render a broken screen.
    return <Redirect href="/" />;
  }

  const { habit, weekCount, streak, chartData, heatmap, history, todayValue, toggleToday } = detail;
  const completedToday = todayValue > 0;

  return (
    <>
      <StatusBar style="dark" />
      <ScreenContainer testID="habit-detail-screen">
        <Header
          layout="center"
          eyebrow="HABIT"
          title={habit.title}
          meta={<Badge label={habit.frequencyBadge} icon={<Ionicons name="leaf" size={11} color={theme.colors.primaryText} />} />}
          leading={
            <IconButton accessibilityLabel="Go back" onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={20} color={theme.colors.textPrimary} />
            </IconButton>
          }
          trailing={
            <IconButton
              accessibilityLabel="More options"
              onPress={() => Alert.alert(habit.title, 'More options coming soon.')}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textPrimary} />
            </IconButton>
          }
        />

        {/* This Week */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg, padding: theme.spacing[4], marginTop: theme.spacing[6] },
            theme.shadows.sm,
          ]}
        >
          <View style={styles.rowBetween}>
            <View>
              <Text style={[theme.typography.subtitle, { color: theme.colors.textSecondary }]}>This Week</Text>
              <Text style={[theme.typography.statLg, { color: theme.colors.textPrimary, marginTop: 2 }]}>
                {weekCount} / 7 days
              </Text>
              <Text style={[theme.typography.subtitle, { color: theme.colors.textSecondary, marginTop: 2 }]}>
                {habit.goalLabel}
              </Text>
            </View>
            <Badge label={`${streak} day streak 🔥`} variant="outline" />
          </View>

          <View style={{ marginTop: theme.spacing[5] }}>
            <WeeklyBarChart data={chartData} accessibilityLabel={`${habit.title} minutes logged this week`} />
          </View>
        </View>

        {/* This Month */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg, padding: theme.spacing[4], marginTop: theme.spacing[4] },
            theme.shadows.sm,
          ]}
        >
          <Text style={[theme.typography.subtitle, { color: theme.colors.textSecondary, marginBottom: theme.spacing[3] }]}>
            This Month
          </Text>

          <View style={styles.heatmapWrap}>
            <CalendarHeatmap weeks={heatmap} accessibilityLabel={`${habit.title} monthly completion calendar`} />
            <View style={styles.mascotOverlay}>
              <MascotGlow size="md" />
            </View>
          </View>

          <Pressable
            onPress={() => Alert.alert('Small days. Big direction.', 'Every logged day compounds — keep going.')}
            accessibilityRole="button"
            style={({ pressed }) => [styles.rowInline, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="leaf-outline" size={14} color={theme.colors.primaryText} />
            <Text style={[theme.typography.subtitle, { color: theme.colors.textSecondary, marginLeft: theme.spacing[1], flex: 1 }]}>
              Small days. Big direction.
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
          </Pressable>
        </View>

        {/* Complete CTA */}
        <View style={{ alignItems: 'center', marginTop: theme.spacing[6] }}>
          <CompleteButton completed={completedToday} onPress={toggleToday} />
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: theme.spacing[2] }]}>
            Tap to log today's {habit.logLabel} 🌱
          </Text>
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.colors.border, marginTop: theme.spacing[3], marginBottom: theme.spacing[2] },
            ]}
          />
          <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>
            {weekCount} times this week — quiet progress
          </Text>
        </View>

        {/* History */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg, padding: theme.spacing[4], marginTop: theme.spacing[6] },
            theme.shadows.sm,
          ]}
        >
          <View style={styles.rowBetween}>
            <Text style={[theme.typography.title, { color: theme.colors.textPrimary }]}>History</Text>
            <Pressable
              onPress={() => Alert.alert('History', 'Full history coming soon.')}
              accessibilityRole="button"
              style={({ pressed }) => [styles.rowInline, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Text style={[theme.typography.subtitle, { color: theme.colors.textSecondary }]}>View all</Text>
              <Ionicons name="chevron-forward" size={14} color={theme.colors.textSecondary} style={{ marginLeft: 2 }} />
            </Pressable>
          </View>

          <View style={{ marginTop: theme.spacing[2] }}>
            {history.map((entry) => (
              <HistoryRow
                key={entry.date}
                date={entry.date}
                dayOfWeek={entry.dayOfWeek}
                valueLabel={entry.valueLabel}
                completed={entry.completed}
                statusLabel={entry.completed ? 'Completed' : 'Not completed'}
              />
            ))}
          </View>
        </View>

        <Text
          style={[
            theme.typography.caption,
            { color: theme.colors.textTertiary, textAlign: 'center', marginTop: theme.spacing[5] },
          ]}
        >
          Consistency is quiet. Progress is real.
        </Text>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  rowInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heatmapWrap: {
    alignItems: 'center',
  },
  mascotOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: 'none',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    width: '60%',
  },
});
