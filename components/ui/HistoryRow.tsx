import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/constants/theme';
import { CheckCircle } from './CheckCircle';

export type HistoryRowProps = {
  /** e.g. "May 16, 2025". */
  date: string;
  /** e.g. "Friday". */
  dayOfWeek: string;
  /** e.g. "20 min". */
  valueLabel: string;
  completed: boolean;
  /** e.g. "Completed" / "Not completed". */
  statusLabel: string;
};

/** A single row in the habit detail "History" list (screen 4). */
export function HistoryRow({ date, dayOfWeek, valueLabel, completed, statusLabel }: HistoryRowProps) {
  const theme = useTheme();

  return (
    <View
      style={[styles.row, { paddingVertical: theme.spacing[2] }]}
      accessible
      accessibilityLabel={`${date}, ${dayOfWeek}, ${valueLabel}, ${statusLabel}`}
    >
      <CheckCircle checked={completed} size={26} />

      <View style={[styles.textStack, { marginLeft: theme.spacing[3] }]}>
        <Text style={[theme.typography.body, { color: completed ? theme.colors.textPrimary : theme.colors.textTertiary }]}>
          {date}
        </Text>
        <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
          {dayOfWeek}
        </Text>
      </View>

      <View style={styles.trailing}>
        <Text
          style={[
            theme.typography.title,
            { color: completed ? theme.colors.textPrimary : theme.colors.textTertiary, fontSize: 15 },
          ]}
        >
          {valueLabel}
        </Text>
        <Text
          style={[
            theme.typography.caption,
            { color: completed ? theme.colors.success : theme.colors.textTertiary, marginTop: 2 },
          ]}
        >
          {statusLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStack: {
    flex: 1,
  },
  trailing: {
    alignItems: 'flex-end',
  },
});

export default HistoryRow;
