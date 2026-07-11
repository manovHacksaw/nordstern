/**
 * Surface card (radius lg, 1px border). The default container for grouped content.
 */
import { View, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/theme-context';

export function Card({
  children,
  style,
  padded = true,
  surface2,
  ...rest
}: ViewProps & { style?: ViewStyle; padded?: boolean; surface2?: boolean }) {
  const { c, radius, space } = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: surface2 ? c.surface2 : c.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: c.border,
          padding: padded ? space.lg : 0,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

/** A thin key/value row used inside summary/quote cards. */
export function Row({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 7 },
        style,
      ]}>
      {children}
    </View>
  );
}
