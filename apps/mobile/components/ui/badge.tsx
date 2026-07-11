/**
 * Pill badge (radius full). `tone` maps to the semantic fill + text colors.
 * Used for balance deltas, method speed labels, and status chips.
 */
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/theme-context';
import { AppText } from './text';

export type Tone = 'success' | 'info' | 'warning' | 'error' | 'brand' | 'neutral';

export function Badge({ label, tone = 'success', style }: { label: string; tone?: Tone; style?: ViewStyle }) {
  const { c } = useTheme();
  const map: Record<Tone, { bg: string; fg: string }> = {
    success: { bg: c.successFill, fg: c.success },
    info: { bg: c.infoFill, fg: c.info },
    warning: { bg: c.warningFill, fg: c.warning },
    error: { bg: c.errorFill, fg: c.error },
    brand: { bg: c.brand100, fg: c.brandText },
    neutral: { bg: c.surface2, fg: c.text2 },
  };
  const { bg, fg } = map[tone];
  return (
    <View
      style={[
        { backgroundColor: bg, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4, alignSelf: 'flex-start' },
        style,
      ]}>
      <AppText variant="label" color={fg}>
        {label}
      </AppText>
    </View>
  );
}
