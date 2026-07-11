/** Settings tab — placeholder (built in Phase B, Task 14). */
import { View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';

export default function SettingsScreen() {
  return (
    <Screen edges={['top']}>
      <View style={{ padding: 18, gap: 6 }}>
        <AppText variant="h1">Settings</AppText>
        <AppText variant="body" dim>
          Account, identity & preferences — coming in Phase B.
        </AppText>
      </View>
    </Screen>
  );
}
