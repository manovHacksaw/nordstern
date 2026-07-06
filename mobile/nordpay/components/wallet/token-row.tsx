/** A token balance row (Home Tokens list, asset lists). Tapping opens Asset detail. */
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { META, PRICES, type AssetSym } from '@/lib/assets';
import { fmt, money } from '@/lib/format';
import { useTheme } from '@/theme/theme-context';

export function TokenRow({
  sym,
  balance,
  hidden,
  onPress,
}: {
  sym: AssetSym;
  balance: number;
  hidden?: boolean;
  onPress?: () => void;
}) {
  const { c, radius } = useTheme();
  const m = META[sym];
  const usd = balance * (PRICES[sym] || 0);
  const amtStr = hidden ? '••••' : `${fmt(balance, 2)} ${sym}`;
  const usdStr = hidden ? '••••' : money(usd);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 11,
        paddingHorizontal: 12,
        borderRadius: radius.md,
        backgroundColor: pressed ? c.surface : 'transparent',
      })}>
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 999,
          backgroundColor: m.color,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppText variant="title" color="#fff">
          {sym.slice(0, 2)}
        </AppText>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText variant="title" color={c.text}>
          {m.name}
        </AppText>
        <AppText variant="mono" dim style={{ fontSize: 12.5, marginTop: 1 }}>
          {amtStr}
        </AppText>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <AppText variant="mono" color={c.text} style={{ fontSize: 15 }}>
          {usdStr}
        </AppText>
        <AppText variant="mono" color={m.up ? c.success : c.error} style={{ fontSize: 12.5, marginTop: 1 }}>
          {m.chg}
        </AppText>
      </View>
    </Pressable>
  );
}
