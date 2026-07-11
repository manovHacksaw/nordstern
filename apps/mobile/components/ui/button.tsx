/**
 * Buttons. Primary = brand-500 fill, radius full. Secondary = surface-2, radius md.
 * Primary renders disabled until its step requirement is met.
 */
import { ActivityIndicator, Pressable, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/theme-context';
import { AppText } from './text';

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  style,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}) {
  const { c } = useTheme();
  const off = disabled || loading;
  return (
    <Pressable
      onPress={off ? undefined : onPress}
      disabled={off}
      style={({ pressed }) => [
        {
          height: 52,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: off ? c.surface2 : pressed ? c.brand700 : c.brand500,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={c.canvas} />
      ) : (
        <AppText variant="title" color={off ? c.text3 : '#1A1A1A'}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  style,
  full,
}: {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  full?: boolean;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: 52,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? c.border : c.surface2,
          borderWidth: 1,
          borderColor: c.border,
          flex: full ? 1 : undefined,
        },
        style,
      ]}>
      <AppText variant="title" color={c.text}>
        {label}
      </AppText>
    </Pressable>
  );
}

/** A circular icon button on a surface — used for the header scan/back affordances. */
export function CircleButton({
  onPress,
  size = 38,
  children,
  style,
}: {
  onPress?: () => void;
  size?: number;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? c.surface2 : c.surface,
          borderWidth: 1,
          borderColor: c.border,
        },
        style,
      ]}>
      <View>{children}</View>
    </Pressable>
  );
}
