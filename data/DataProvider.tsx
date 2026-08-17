import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { useTheme } from '@/constants/theme';
import { MascotGlow } from '@/components/ui';
import { toISODate } from '@/lib/date';
import { STORAGE_KEYS, readJSON, writeJSON } from './storage';
import { createSeedCompletions, SEED_CIRCLES, SEED_HABITS } from './seed';
import type { CircleGroup, CompletionsMap, Habit, HabitId } from './types';

type DataContextValue = {
  habits: Habit[];
  completions: CompletionsMap;
  circles: CircleGroup[];
  /** Sets the logged amount for a habit on a given day (0 clears it). Persists immediately. */
  setCompletion: (habitId: HabitId, date: Date, value: number) => void;
  /** Toggles today's entry between 0 and the habit's default log amount. */
  toggleHabitToday: (habitId: HabitId) => void;
  toggleCircleLiked: (circleId: string) => void;
  /** Wipes all persisted data and reseeds — handy for QA, exposed for that purpose. */
  resetAllData: () => void;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const [ready, setReady] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<CompletionsMap>({});
  const [circles, setCircles] = useState<CircleGroup[]>([]);

  // Hydrate from disk once on mount; seed on first-ever launch. Entirely
  // local — no network request is made anywhere in this flow.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [storedHabits, storedCompletions, storedCircles] = await Promise.all([
        readJSON<Habit[]>(STORAGE_KEYS.habits),
        readJSON<CompletionsMap>(STORAGE_KEYS.completions),
        readJSON<CircleGroup[]>(STORAGE_KEYS.circles),
      ]);

      const nextHabits = storedHabits ?? SEED_HABITS;
      const nextCompletions = storedCompletions ?? createSeedCompletions(nextHabits);
      const nextCircles = storedCircles ?? SEED_CIRCLES;

      if (!storedHabits) writeJSON(STORAGE_KEYS.habits, nextHabits);
      if (!storedCompletions) writeJSON(STORAGE_KEYS.completions, nextCompletions);
      if (!storedCircles) writeJSON(STORAGE_KEYS.circles, nextCircles);

      if (cancelled) return;
      setHabits(nextHabits);
      setCompletions(nextCompletions);
      setCircles(nextCircles);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setCompletion = useCallback((habitId: HabitId, date: Date, value: number) => {
    setCompletions((prev) => {
      const dateKey = toISODate(date);
      const habitEntries = { ...(prev[habitId] ?? {}) };
      if (value > 0) {
        habitEntries[dateKey] = value;
      } else {
        delete habitEntries[dateKey];
      }
      const next = { ...prev, [habitId]: habitEntries };
      writeJSON(STORAGE_KEYS.completions, next);
      return next;
    });
  }, []);

  const toggleHabitToday = useCallback(
    (habitId: HabitId) => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;
      const today = new Date();
      const alreadyDone = (completions[habitId]?.[toISODate(today)] ?? 0) > 0;
      setCompletion(habitId, today, alreadyDone ? 0 : habit.defaultLogValue);
    },
    [habits, completions, setCompletion]
  );

  const toggleCircleLiked = useCallback((circleId: string) => {
    setCircles((prev) => {
      const next = prev.map((c) => (c.id === circleId ? { ...c, liked: !c.liked } : c));
      writeJSON(STORAGE_KEYS.circles, next);
      return next;
    });
  }, []);

  const resetAllData = useCallback(() => {
    const seededCompletions = createSeedCompletions(SEED_HABITS);
    setHabits(SEED_HABITS);
    setCompletions(seededCompletions);
    setCircles(SEED_CIRCLES);
    writeJSON(STORAGE_KEYS.habits, SEED_HABITS);
    writeJSON(STORAGE_KEYS.completions, seededCompletions);
    writeJSON(STORAGE_KEYS.circles, SEED_CIRCLES);
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({ habits, completions, circles, setCompletion, toggleHabitToday, toggleCircleLiked, resetAllData }),
    [habits, completions, circles, setCompletion, toggleHabitToday, toggleCircleLiked, resetAllData]
  );

  if (!ready) {
    return (
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}
      >
        <MascotGlow size="lg" />
      </View>
    );
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData() must be called within a <DataProvider>');
  return ctx;
}
