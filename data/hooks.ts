import { useMemo } from 'react';

import { useData } from './DataProvider';
import {
  getCurrentStreak,
  getHistory,
  getMonthHeatmap,
  getValueOnDate,
  getWeekActivity,
  getWeekCompletedCount,
  getWeeklyBarChartData,
  getWeeklyStats,
} from './selectors';
import type { HabitId } from './types';

/**
 * Everything the "Today" screen needs, pre-derived: each habit alongside
 * whether it's logged for today, plus the weekly ring stat.
 */
export function useTodayHabits(referenceDate: Date = new Date()) {
  const { habits, completions, toggleHabitToday } = useData();

  const items = useMemo(
    () =>
      habits.map((habit) => ({
        habit,
        doneToday: getValueOnDate(completions, habit.id, referenceDate) > 0,
      })),
    [habits, completions, referenceDate]
  );

  const weeklyStats = useMemo(() => getWeeklyStats(completions, habits, referenceDate), [completions, habits, referenceDate]);

  return { items, weeklyStats, toggleHabitToday };
}

/** Everything the "This Week" screen needs: per-habit weekly counts + the day-activity strip. */
export function useWeekOverview(referenceDate: Date = new Date()) {
  const { habits, completions } = useData();

  const items = useMemo(
    () =>
      habits.map((habit) => ({
        habit,
        weekCount: getWeekCompletedCount(completions, habit.id, referenceDate),
      })),
    [habits, completions, referenceDate]
  );

  const weekActivity = useMemo(() => getWeekActivity(completions, habits, referenceDate), [completions, habits, referenceDate]);

  const percentComplete = useMemo(() => {
    const totalPossible = habits.length * 7;
    if (totalPossible === 0) return 0;
    const totalDone = items.reduce((sum, i) => sum + i.weekCount, 0);
    return Math.round((totalDone / totalPossible) * 100);
  }, [items, habits.length]);

  return { items, weekActivity, percentComplete };
}

/** Full detail-screen bundle for a single habit — chart, heatmap, history, streak, today's state. */
export function useHabitDetail(habitId: HabitId | undefined, referenceDate: Date = new Date()) {
  const { habits, completions, setCompletion } = useData();
  const habit = useMemo(() => habits.find((h) => h.id === habitId), [habits, habitId]);

  const detail = useMemo(() => {
    if (!habit) return null;
    return {
      weekCount: getWeekCompletedCount(completions, habit.id, referenceDate),
      streak: getCurrentStreak(completions, habit.id, referenceDate),
      chartData: getWeeklyBarChartData(completions, habit.id, referenceDate),
      heatmap: getMonthHeatmap(completions, habit.id, referenceDate),
      history: getHistory(completions, habit, referenceDate),
      todayValue: getValueOnDate(completions, habit.id, referenceDate),
    };
  }, [habit, completions, referenceDate]);

  const toggleToday = () => {
    if (!habit) return;
    const alreadyDone = (detail?.todayValue ?? 0) > 0;
    setCompletion(habit.id, referenceDate, alreadyDone ? 0 : habit.defaultLogValue);
  };

  return habit && detail ? { habit, ...detail, toggleToday } : null;
}
