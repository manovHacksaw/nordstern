/** Activity tab — placeholder (full history built in Phase B, Task 13). */
import { View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';

export default function ActivityScreen() {
  return (
    <Screen edges={['top']}>
      <View style={{ padding: 18, gap: 6 }}>
        <AppText variant="h1">Activity</AppText>
        <AppText variant="body" dim>
          Full transaction history — coming in Phase B.
        </AppText>
      </View>
    </Screen>
  );
}
