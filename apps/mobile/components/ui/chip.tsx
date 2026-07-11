/** Selectable pill chip (KYC document types, cross-border country/method pickers). */
import { Pressable } from 'react-native';

import { AppText } from './text';
import { useTheme } from '@/theme/theme-context';

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 9,
        paddingHorizontal: 14,
        borderRadius: 999,
        backgroundColor: c.surface,
        borderWidth: 1.5,
        borderColor: selected ? c.brand500 : c.border,
      }}>
      <AppText variant="bodyStrong" color={selected ? c.brand500 : c.text2} style={{ fontSize: 12.5 }}>
        {label}
      </AppText>
    </Pressable>
  );
}
