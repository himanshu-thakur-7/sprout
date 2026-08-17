import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme';

export type SoftTabItem = {
  key: string;
  label: string;
  /** Render prop so any icon set (Ionicons, custom SVG, …) can be used. */
  icon: (props: { color: string; focused: boolean; size: number }) => React.ReactNode;
};

export type SoftTabBarProps = {
  items: SoftTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
};

/**
 * The floating pill tab bar used at the bottom of every screen. Active tab
 * is signaled by icon/label color plus a small dot underneath — not by a
 * background pill — matching the source screens exactly.
 *
 * Standalone by default; to drive it from Expo Router's <Tabs>, pass it as
 * the `tabBar` prop and map `state`/`navigation` to `activeKey`/`onChange`:
 *
 *   <Tabs tabBar={(props) => (
 *     <SoftTabBar
 *       items={items}
 *       activeKey={props.state.routeNames[props.state.index]}
 *       onChange={(key) => props.navigation.navigate(key)}
 *     />
 *   )} />
 */
export function SoftTabBar({ items, activeKey, onChange }: SoftTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: Math.max(insets.bottom, theme.spacing[2]),
          paddingHorizontal: theme.layout.screenPaddingX,
        },
      ]}
    >
      <View
        style={[
          theme.components.tabBar,
          styles.bar,
          { paddingHorizontal: theme.spacing[2] },
        ]}
        accessibilityRole="tablist"
      >
        {items.map((item) => {
          const focused = item.key === activeKey;
          const color = focused ? theme.components.tabIconActive : theme.components.tabIconInactive;

          return (
            <Pressable
              key={item.key}
              onPress={() => onChange(item.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={item.label}
              hitSlop={4}
              style={styles.item}
            >
              {item.icon({ color, focused, size: 22 })}
              <Text
                style={[
                  theme.typography.caption,
                  { color, marginTop: 4, fontSize: 11 },
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: focused ? theme.colors.primary : 'transparent',
                    width: theme.components.tabActiveDotSize,
                    height: theme.components.tabActiveDotSize,
                    borderRadius: theme.components.tabActiveDotSize,
                  },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  dot: {
    marginTop: 4,
  },
});

export default SoftTabBar;
