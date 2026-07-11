/** Segmented control (Home Tokens/Activity, and reused by flow pickers). */
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-context';

export type SegOption<T extends string> = { value: T; label: string };

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: SegOption<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { c } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: c.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: c.border,
        padding: 3,
        gap: 3,
      }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 9,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: active ? c.surface2 : 'transparent',
            }}>
            <AppText variant="bodyStrong" color={active ? c.text : c.text2}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
