/**
 * Placeholder for a pushed flow route not yet built (Phase B). Keeps Home's quick
 * actions clickable during the Phase A review without dead-ending on a 404.
 */
import { View } from 'react-native';

import { Screen, FlowHeader } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';

export function StubScreen({ title, note }: { title: string; note: string }) {
  return (
    <Screen edges={['top']}>
      <FlowHeader title={title} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <AppText variant="body" dim style={{ textAlign: 'center' }}>
          {note}
        </AppText>
      </View>
    </Screen>
  );
}
