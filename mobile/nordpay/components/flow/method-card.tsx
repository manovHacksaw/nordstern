/** A funding-method option card (deposit step 0): icon tile · label/desc · speed badge. */
import { Pressable, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-context';

export function MethodCard({
  icon,
  label,
  desc,
  badge,
  selected,
  onPress,
}: {
  icon: IconName;
  label: string;
  desc: string;
  badge: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const { c, radius } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
        padding: 14,
        backgroundColor: c.surface,
        borderWidth: 1.5,
        borderColor: selected ? c.brand500 : c.border,
        borderRadius: radius.md,
        marginBottom: 10,
      }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: c.surface2,
          borderWidth: 1,
          borderColor: c.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name={icon} size={20} color={c.brand500} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText variant="bodyStrong" color={c.text} style={{ fontSize: 14.5 }}>
          {label}
        </AppText>
        <AppText variant="caption" dim style={{ marginTop: 1 }}>
          {desc}
        </AppText>
      </View>
      <View
        style={{
          backgroundColor: c.successFill,
          paddingVertical: 3,
          paddingHorizontal: 8,
          borderRadius: 999,
        }}>
        <AppText variant="bodyStrong" color={c.success} style={{ fontSize: 10.5 }}>
          {badge}
        </AppText>
      </View>
    </Pressable>
  );
}
