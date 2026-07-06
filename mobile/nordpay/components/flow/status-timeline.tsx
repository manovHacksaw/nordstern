/** The 3-row settlement timeline on a flow's final status step. */
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-context';

export type TimelineState = 'done' | 'active' | 'pending';
export type TimelineRow = { label: string; state: TimelineState };

export function StatusTimeline({ rows }: { rows: TimelineRow[] }) {
  const { c, radius } = useTheme();
  return (
    <View
      style={{
        backgroundColor: c.surface,
        borderWidth: 1,
        borderColor: c.border,
        borderRadius: radius.lg,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 16,
      }}>
      {rows.map((r) => {
        const dot = r.state === 'done' ? c.success : r.state === 'active' ? c.brand500 : c.surface2;
        const text = r.state === 'pending' ? c.text3 : c.text;
        return (
          <View key={r.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                backgroundColor: dot,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {r.state === 'done' && <Icon name="check" size={14} color="#fff" strokeWidth={3} />}
            </View>
            <AppText color={text} style={{ fontSize: 14 }}>
              {r.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}
