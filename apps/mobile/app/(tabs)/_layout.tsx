import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { Icon, type IconName } from '@/components/ui/icon';
import { Font } from '@/theme/fonts';
import { useTheme } from '@/theme/theme-context';

export default function TabLayout() {
  const { c } = useTheme();

  const tab = (name: IconName) =>
    ({ color }: { color: string }) => <Icon name={name} size={24} color={color} strokeWidth={1.9} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: c.brand500,
        tabBarInactiveTintColor: c.text2,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontFamily: Font.bodySemibold, fontSize: 11 },
        sceneStyle: { backgroundColor: c.canvas },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Wallet', tabBarIcon: tab('walletTab') }} />
      <Tabs.Screen name="anchors" options={{ title: 'Anchors', tabBarIcon: tab('anchorsTab') }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity', tabBarIcon: tab('activityTab') }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: tab('settingsTab') }} />
    </Tabs>
  );
}
