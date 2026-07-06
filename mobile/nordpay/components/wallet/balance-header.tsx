/** Home top: account row (avatar · "Account 1 ▾" · scan) + centered total-balance block. */
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { CircleButton } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-context';

/** Gradient identity avatar (Perano brand-500 → brand-900). */
export function GradientAvatar({ initials, size = 38 }: { initials: string; size?: number }) {
  const { c } = useTheme();
  return (
    <LinearGradient
      colors={[c.brand500, c.brand900] as const}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: c.border,
      }}>
      <AppText variant="title" color="#fff" style={{ fontSize: size * 0.37 }}>
        {initials}
      </AppText>
    </LinearGradient>
  );
}

export function BalanceHeader({ total, onScan }: { total: string; onScan?: () => void }) {
  const { c } = useTheme();
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 18,
          paddingTop: 6,
          paddingBottom: 2,
        }}>
        <GradientAvatar initials="AR" />
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: c.surface,
            borderWidth: 1,
            borderColor: c.border,
            borderRadius: 999,
            paddingVertical: 7,
            paddingHorizontal: 14,
          }}>
          <AppText variant="title" color={c.text}>
            Account 1
          </AppText>
          <AppText color={c.text2}>▾</AppText>
        </Pressable>
        <CircleButton onPress={onScan}>
          <Icon name="scan" size={18} color={c.text} strokeWidth={1.75} />
        </CircleButton>
      </View>

      <View style={{ alignItems: 'center', paddingTop: 20, paddingBottom: 6 }}>
        <AppText color={c.text2} style={{ fontSize: 13, letterSpacing: 0.26 }}>
          Total balance
        </AppText>
        <AppText variant="display" color={c.text} style={{ marginTop: 6 }}>
          {total}
        </AppText>
        <View style={{ marginTop: 10 }}>
          <Badge label="+$48.20 · +2.13%" tone="success" />
        </View>
      </View>
    </View>
  );
}
