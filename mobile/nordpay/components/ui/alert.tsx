/** An inline reassurance / info strip: tinted fill · leading icon · message. */
import { View } from 'react-native';

import { Icon, type IconName } from './icon';
import { AppText } from './text';
import { useTheme } from '@/theme/theme-context';

export type AlertTone = 'info' | 'success' | 'brand';

export function Alert({
  tone = 'info',
  icon,
  children,
}: {
  tone?: AlertTone;
  icon: IconName;
  children: string;
}) {
  const { c, radius } = useTheme();
  const bg = tone === 'success' ? c.successFill : tone === 'brand' ? c.brand100 : c.infoFill;
  const fg = tone === 'success' ? c.success : tone === 'brand' ? c.brand700 : c.info;
  const textColor = tone === 'brand' ? c.brand900 : c.text;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: bg,
        borderRadius: radius.md,
        paddingVertical: 12,
        paddingHorizontal: 14,
      }}>
      <Icon name={icon} size={20} color={fg} strokeWidth={1.9} />
      <AppText color={textColor} style={{ flex: 1, fontSize: 12.5, lineHeight: 18 }}>
        {children}
      </AppText>
    </View>
  );
}
