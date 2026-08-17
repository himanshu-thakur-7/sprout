/**
 * Pure derivations over the completions store — no React, no I/O. Every
 * number the UI shows (streaks, weekly stats, chart heights, the monthly
 * heatmap) is computed here from the raw `CompletionsMap` rather than
 * stored redundantly, so there's exactly one source of truth per habit.
 */
import type { HeatmapCellState } from '@/components/ui';
import { DAY_LABELS, addDays, getMonthGrid, getWeekDates, isSameDay, startOfDay, toISODate, formatLongDate, formatWeekday } from '@/lib/date';
import type { CompletionsMap, Habit, HabitId } from './types';

export function getValueOnDate(completions: CompletionsMap, habitId: HabitId, date: Date): number {
  return completions[habitId]?.[toISODate(date)] ?? 0;
}

export function isDoneOnDate(completions: CompletionsMap, habitId: HabitId, date: Date): boolean {
  return getValueOnDate(completions, habitId, date) > 0;
}

export function getWeekValues(completions: CompletionsMap, habitId: HabitId, referenceDate: Date) {
  return getWeekDates(referenceDate).map((date) => ({ date, value: getValueOnDate(completions, habitId, date) }));
}

export function getWeekCompletedCount(completions: CompletionsMap, habitId: HabitId, referenceDate: Date): number {
  return getWeekValues(completions, habitId, referenceDate).filter((d) => d.value > 0).length;
}

/**
 * Consecutive completed days counting back from `referenceDate` — with a
 * one-day grace period: if today isn't logged yet, counting starts from
 * yesterday instead, so an active streak doesn't read as broken the moment
 * midnight passes and before today's entry has a chance to be logged
 * (matches the source screen, where a "4 day streak" badge is shown
 * alongside a still-unpressed "Complete Today" button).
 */
function streakStartDate(completions: CompletionsMap, habitId: HabitId, referenceDate: Date): Date {
  const today = startOfDay(referenceDate);
  return isDoneOnDate(completions, habitId, today) ? today : addDays(today, -1);
}

export function getCurrentStreak(completions: CompletionsMap, habitId: HabitId, referenceDate: Date): number {
  let streak = 0;
  let cursor = streakStartDate(completions, habitId, referenceDate);
  while (isDoneOnDate(completions, habitId, cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function getCurrentStreakDateSet(completions: CompletionsMap, habitId: HabitId, referenceDate: Date): Set<string> {
  const dates = new Set<string>();
  let cursor = streakStartDate(completions, habitId, referenceDate);
  while (isDoneOnDate(completions, habitId, cursor)) {
    dates.add(toISODate(cursor));
    cursor = addDays(cursor, -1);
  }
  return dates;
}

/** The 7-day Mon…Sun bar-chart data for the habit detail screen. */
export function getWeeklyBarChartData(completions: CompletionsMap, habitId: HabitId, referenceDate: Date) {
  return getWeekValues(completions, habitId, referenceDate).map(({ date, value }, index) => ({
    label: DAY_LABELS[index],
    value,
    highlighted: isSameDay(date, referenceDate),
  }));
}

/**
 * The "This Month" heatmap grid. Cells in the active streak render as the
 * amber 'highlight' state (matching the source screen's emphasis on
 * consistency), other logged days as 'filled', everything else 'empty'.
 */
export function getMonthHeatmap(completions: CompletionsMap, habitId: HabitId, referenceDate: Date): HeatmapCellState[][] {
  const streakDates = getCurrentStreakDateSet(completions, habitId, referenceDate);
  const month = referenceDate.getMonth();

  return getMonthGrid(referenceDate).map((week) =>
    week.map((date): HeatmapCellState => {
      if (date.getMonth() !== month) return 'empty';
      if (!isDoneOnDate(completions, habitId, date)) return 'empty';
      return streakDates.has(toISODate(date)) ? 'highlight' : 'filled';
    })
  );
}

export function getHistory(completions: CompletionsMap, habit: Habit, referenceDate: Date, count = 4) {
  return Array.from({ length: count }, (_, i) => addDays(referenceDate, -1 - i)).map((date) => {
    const value = getValueOnDate(completions, habit.id, date);
    return {
      date: formatLongDate(date),
      dayOfWeek: formatWeekday(date),
      valueLabel: `${value} ${habit.unit}`,
      completed: value > 0,
    };
  });
}

/** Days this week (Mon…Sun) with at least one habit logged. */
export function getWeekActivity(completions: CompletionsMap, habits: Habit[], referenceDate: Date): boolean[] {
  return getWeekDates(referenceDate).map((date) => habits.some((h) => isDoneOnDate(completions, h.id, date)));
}

/** The "Today" ring: how many of the last 7 days had at least one habit logged. */
export function getWeeklyStats(completions: CompletionsMap, habits: Habit[], referenceDate: Date) {
  const done = getWeekActivity(completions, habits, referenceDate).filter(Boolean).length;
  return { done, total: 7 };
}
