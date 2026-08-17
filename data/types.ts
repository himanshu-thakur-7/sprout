import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type HabitId = string;

export type Habit = {
  id: HabitId;
  title: string;
  /** Short tagline ("Hydrate your body") shown on the "This Week" card. */
  description: string;
  /** "3x this week" — shown on the "Today" card. */
  frequencyLabel: string;
  /** "Daily" — badge on the detail screen. */
  frequencyBadge: string;
  icon: IoniconName;
  goalLabel: string;
  /** Fills "Tap to log today's ___" on the detail screen, e.g. "reading". */
  logLabel: string;
  /** Unit for the logged amount, e.g. "min", "glasses", "entry". */
  unit: string;
  /** What one tap of the Today/CompleteButton toggle logs, e.g. 20 (minutes). */
  defaultLogValue: number;
};

/** habitId → ISO date ("2026-08-17") → amount logged that day. 0/absent = not done. */
export type CompletionsMap = Record<HabitId, Record<string, number>>;

export type CircleMemberId = string;

export type CircleMember = {
  id: CircleMemberId;
  name: string;
  avatarUri?: string;
  done: boolean;
  statusLabel: string;
};

export type CircleGroup = {
  id: string;
  title: string;
  icon: IoniconName;
  memberCountLabel: string;
  members: CircleMember[];
  liked: boolean;
};

export const STORE_VERSION = 1;
