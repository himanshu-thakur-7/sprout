/**
 * Small, dependency-free date helpers for the habit store. Everything here
 * works in local time and treats Monday as the first day of the week (to
 * match the Mon…Sun layout in the source screens).
 */

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b);
}

/** Monday of the week containing `date`. */
export function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay(); // 0 = Sun … 6 = Sat
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return addDays(d, mondayOffset);
}

/** The 7 dates (Mon…Sun) of the week containing `date`. */
export function getWeekDates(date: Date): Date[] {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * A Monday-start calendar grid (array of 7-date weeks) covering the month
 * `date` falls in — always at least 4 rows, never more than 6, matching the
 * "This Month" heatmap on the habit detail screen.
 */
export function getMonthGrid(date: Date): Date[][] {
  const gridStart = startOfWeek(startOfMonth(date));
  const lastOfMonth = endOfMonth(date);

  const weeks: Date[][] = [];
  let cursor = gridStart;
  while (weeks.length < 6) {
    const week = Array.from({ length: 7 }, (_, i) => addDays(cursor, i));
    weeks.push(week);
    cursor = addDays(cursor, 7);
    if (cursor > lastOfMonth && weeks.length >= 4) break;
  }
  return weeks;
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatWeekday(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}
