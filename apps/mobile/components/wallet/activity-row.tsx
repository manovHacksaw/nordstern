/** A transaction row (Home Activity preview + the Activity tab). */
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { STATUS_TONE, TYPE_ICON, type ActivityRow as Row, type ActivityStatus } from '@/lib/activity';
import { useTheme } from '@/theme/theme-context';

export function ActivityRow({ row, border }: { row: Row; border?: boolean }) {
  const { c } = useTheme();
  const statusColors: Record<ActivityStatus, string> = {
    Completed: c.success,
    Processing: c.info,
    Pending: c.warning,
    Failed: c.error,
  };
  void STATUS_TONE; // tone map available for badge use; row uses the direct color
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 6,
        borderBottomWidth: border ? 1 : 0,
        borderBottomColor: c.border,
      }}>
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 999,
          backgroundColor: c.surface2,
          borderWidth: 1,
          borderColor: c.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name={TYPE_ICON[row.type]} size={18} color={c.brand500} strokeWidth={1.9} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText variant="bodyStrong" color={c.text}>
          {row.title}
        </AppText>
        <AppText variant="caption" dim style={{ marginTop: 1 }}>
          {row.sub}
        </AppText>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <AppText variant="mono" color={row.up ? c.success : c.text} style={{ fontSize: 13.5 }}>
          {row.amount}
        </AppText>
        <AppText color={statusColors[row.status]} style={{ fontSize: 11, marginTop: 1 }}>
          {row.status}
        </AppText>
      </View>
    </View>
  );
}
