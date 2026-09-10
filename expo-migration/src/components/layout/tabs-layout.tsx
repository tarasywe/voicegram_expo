import { Icon, SettingsIcon } from '@ui/icon';
import { Tabs } from 'expo-router/tabs';
import { WaveformIcon } from '@/components/shared';
import { palettes, useResolvedTheme } from '@/theme';
import { ProfileTabIcon } from './profile-tab-icon';

type TabIconProps = { focused: boolean };

const tabIconClass = (focused: boolean) =>
  focused ? 'text-primary' : 'text-muted-foreground';

/** Articles first — it is where the app is actually used. */
export function TabsLayout() {
  const resolved = useResolvedTheme();
  const palette = palettes[resolved];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.mutedForeground,
        tabBarStyle: {
          backgroundColor: palette.card,
          borderTopColor: palette.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Articles',
          tabBarIcon: ({ focused }: TabIconProps) => (
            <Icon as={WaveformIcon} size="lg" className={tabIconClass(focused)} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }: TabIconProps) => <ProfileTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }: TabIconProps) => (
            <Icon as={SettingsIcon} size="lg" className={tabIconClass(focused)} />
          ),
        }}
      />
    </Tabs>
  );
}
