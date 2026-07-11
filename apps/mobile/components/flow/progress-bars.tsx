/** Step progress: N bars filled up to the current step + a mono caption. */
import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-context';

export function ProgressBars({ labels, step }: { labels: string[]; step: number }) {
  const { c } = useTheme();
  const active = Math.min(step, labels.length - 1);
  return (
    <View style={{ paddingHorizontal: 18, paddingTop: 8, paddingBottom: 12 }}>
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 7 }}>
        {labels.map((l, i) => (
          <View
            key={l}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 999,
              backgroundColor: i <= active ? c.brand500 : c.border,
            }}
          />
        ))}
      </View>
      <AppText variant="mono" dim style={{ fontSize: 11 }}>
        {labels[active]}
      </AppText>
    </View>
  );
}
