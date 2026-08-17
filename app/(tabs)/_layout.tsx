import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { SoftTabBar, SoftTabItem } from '@/components/ui';

const TAB_ITEMS: SoftTabItem[] = [
  {
    key: 'index',
    label: 'Today',
    icon: ({ color, size }) => <Ionicons name="sunny-outline" size={size} color={color} />,
  },
  {
    key: 'week',
    label: 'Week',
    icon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
  },
  {
    key: 'circles',
    label: 'Circles',
    icon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
  },
];

// Minimal shape we actually use from React Navigation's tab bar render-prop —
// kept local instead of importing the internal type, since expo-router
// vendors its own copy of @react-navigation/bottom-tabs rather than
// depending on the public package.
type TabBarRenderProps = {
  state: { routeNames: string[]; index: number };
  navigation: { navigate: (key: string) => void };
};

function TabBar({ state, navigation }: TabBarRenderProps) {
  const activeKey = state.routeNames[state.index];

  return <SoftTabBar items={TAB_ITEMS} activeKey={activeKey} onChange={(key) => navigation.navigate(key)} />;
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Today' }} />
      <Tabs.Screen name="week" options={{ title: 'Week' }} />
      <Tabs.Screen name="circles" options={{ title: 'Circles' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
