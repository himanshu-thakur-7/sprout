/**
 * First-run seed data. Runs exactly once per install — DataProvider only
 * calls into this module when AsyncStorage has nothing persisted yet.
 * After that, everything the user does is the real source of truth.
 */
import { addDays, startOfDay, toISODate } from '@/lib/date';
import type { CircleGroup, CompletionsMap, Habit } from './types';

export const SEED_HABITS: Habit[] = [
  {
    id: 'drink-water',
    title: 'Drink Water',
    description: 'Hydrate your body',
    frequencyLabel: '3x this week',
    frequencyBadge: 'Daily',
    icon: 'water-outline',
    goalLabel: 'Goal: 8 glasses a day',
    logLabel: 'water intake',
    unit: 'glasses',
    defaultLogValue: 8,
  },
  {
    id: 'sleep',
    title: 'Sleep by 10:30 PM',
    description: 'Rest and recover',
    frequencyLabel: '3x this week',
    frequencyBadge: 'Daily',
    icon: 'moon-outline',
    goalLabel: 'Goal: asleep before 10:30 PM',
    logLabel: 'bedtime',
    unit: 'night',
    defaultLogValue: 1,
  },
  {
    id: 'move',
    title: 'Move My Body',
    description: 'Walk or stretch',
    frequencyLabel: '3x this week',
    frequencyBadge: 'Daily',
    icon: 'walk-outline',
    goalLabel: 'Goal: 15 minutes of movement',
    logLabel: 'movement',
    unit: 'min',
    defaultLogValue: 20,
  },
  {
    id: 'reflect',
    title: 'Write & Reflect',
    description: 'Reflect & appreciate',
    frequencyLabel: '3x this week',
    frequencyBadge: 'Daily',
    icon: 'create-outline',
    goalLabel: 'Goal: a short daily journal entry',
    logLabel: 'reflection',
    unit: 'entry',
    defaultLogValue: 1,
  },
  {
    id: 'read',
    title: 'Read 20 min',
    description: 'Read Mindfully — 10 minutes a day',
    frequencyLabel: '3x this week',
    frequencyBadge: 'Daily',
    icon: 'book-outline',
    goalLabel: 'Goal: 20 minutes of reading',
    logLabel: 'reading',
    unit: 'min',
    defaultLogValue: 20,
  },
];

export const SEED_CIRCLES: CircleGroup[] = [
  {
    id: 'family-pod',
    title: 'Family Pod',
    icon: 'leaf-outline',
    memberCountLabel: 'Private circle · 5 members',
    liked: false,
    members: [
      { id: 'you', name: 'You', done: true, statusLabel: 'Just now' },
      { id: 'anna', name: 'Anna', done: true, statusLabel: 'Just now' },
      { id: 'maya', name: 'Maya', done: true, statusLabel: '9:12 AM' },
      { id: 'dad', name: 'Dad', done: true, statusLabel: '8:47 AM' },
      { id: 'leo', name: 'Leo', done: false, statusLabel: 'Pending' },
    ],
  },
  {
    id: 'morning-crew',
    title: 'Morning Crew',
    icon: 'sunny-outline',
    memberCountLabel: 'Private circle · 6 members',
    liked: false,
    members: [
      { id: 'you', name: 'You', done: true, statusLabel: 'Just now' },
      { id: 'sam', name: 'Sam', done: false, statusLabel: '7:35 AM' },
      { id: 'elena', name: 'Elena', done: false, statusLabel: '7:20 AM' },
      { id: 'jordan', name: 'Jordan', done: false, statusLabel: 'Pending' },
      { id: 'taylor', name: 'Taylor', done: false, statusLabel: 'Pending' },
    ],
  },
];

/**
 * Deterministic 0..1 hash (FNV-1a + Murmur3 fmix32 finalizer) — same
 * (habitId, date) always seeds the same "history". Cheaper finalizers (a
 * single xor-shift) left visible bias for some habit-id/date prefixes —
 * e.g. every "reflect:2026-08-…" roll landing under 0.57 — which produced
 * unrealistic multi-week unbroken streaks. This finalizer was verified to
 * produce a near-0.5 mean with full 0..1 spread across all five habit ids.
 */
function pseudoRandom(seedStr: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

const HISTORY_DAYS = 35;

/**
 * Backfills a plausible completion history ending yesterday (today is left
 * unlogged so the toggle/CompleteButton has something to demonstrate on
 * first launch, matching the source screens). Recent days are weighted
 * toward "done" so a fresh install shows an active streak, not a blank grid.
 */
export function createSeedCompletions(habits: Habit[], today: Date = new Date()): CompletionsMap {
  const completions: CompletionsMap = {};

  for (const habit of habits) {
    const byDate: Record<string, number> = {};

    for (let offset = 1; offset <= HISTORY_DAYS; offset++) {
      const date = addDays(startOfDay(today), -offset);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const recencyBoost = offset <= 4 ? 0.35 : 0;
      const baseRate = (isWeekend ? 0.35 : 0.65) + recencyBoost;

      const roll = pseudoRandom(`${habit.id}:${toISODate(date)}`);
      if (roll < baseRate) {
        // small variance around the habit's default log amount
        const variance = pseudoRandom(`${habit.id}:${toISODate(date)}:v`);
        const amount = Math.max(1, Math.round(habit.defaultLogValue * (0.8 + variance * 0.4)));
        byDate[toISODate(date)] = amount;
      }
    }

    completions[habit.id] = byDate;
  }

  return completions;
}
