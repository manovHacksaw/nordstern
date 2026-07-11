/** The 5-up quick-action row on Home: Deposit · Withdraw · Send · Receive · Swap. */
import { Pressable, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-context';

type Action = { icon: IconName; label: string; onPress?: () => void };

function QuickAction({ icon, label, onPress }: Action) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ flex: 1, alignItems: 'center', gap: 7, opacity: pressed ? 0.6 : 1 })}>
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 999,
          backgroundColor: c.surface2,
          borderWidth: 1,
          borderColor: c.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name={icon} size={22} color={c.brand500} strokeWidth={2} />
      </View>
      <AppText variant="bodyStrong" color={c.text} style={{ fontSize: 11.5 }}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function QuickActions({
  onDeposit,
  onWithdraw,
  onSend,
  onReceive,
  onSwap,
}: {
  onDeposit?: () => void;
  onWithdraw?: () => void;
  onSend?: () => void;
  onReceive?: () => void;
  onSwap?: () => void;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 4 }}>
      <QuickAction icon="plus" label="Deposit" onPress={onDeposit} />
      <QuickAction icon="withdraw" label="Withdraw" onPress={onWithdraw} />
      <QuickAction icon="send" label="Send" onPress={onSend} />
      <QuickAction icon="receive" label="Receive" onPress={onReceive} />
      <QuickAction icon="swap" label="Swap" onPress={onSwap} />
    </View>
  );
}
