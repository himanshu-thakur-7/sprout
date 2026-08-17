import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme';

export type ScreenContainerProps = {
  children: React.ReactNode;
  /** Set false for screens that manage their own scrolling/pinned layout. */
  scroll?: boolean;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
  testID?: string;
};

/**
 * Shared screen shell: warm paper background, safe-area-aware top inset,
 * standard horizontal screen margin, and bottom padding that clears the
 * floating SoftTabBar. Every screen in the app sits on top of this.
 */
export function ScreenContainer({ children, scroll = true, contentContainerStyle, testID }: ScreenContainerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const padding = {
    paddingTop: insets.top + theme.spacing[3],
    paddingHorizontal: theme.layout.screenPaddingX,
    paddingBottom: theme.layout.tabBarHeight + insets.bottom + theme.spacing[6],
  };

  if (!scroll) {
    return (
      <View style={[styles.flex, { backgroundColor: theme.colors.background }, padding]} testID={testID}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[padding, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      testID={testID}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default ScreenContainer;
