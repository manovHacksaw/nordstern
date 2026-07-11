/**
 * A quote / summary card: key-value rows separated by hairlines, with an optional
 * emphasized final row ("You receive"). Used by every flow's amount + review steps.
 */
import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-context';

export type QuoteRow = {
  label: string;
  value: string;
  /** emphasize as the headline "you receive" row (brand mono 16/600). */
  emphasize?: boolean;
  /** render the value in the body font instead of mono (e.g. method / anchor name). */
  plain?: boolean;
  valueColor?: string;
};

export function QuoteCard({ rows }: { rows: QuoteRow[] }) {
  const { c, radius } = useTheme();
  return (
    <View
      style={{
        backgroundColor: c.surface,
        borderWidth: 1,
        borderColor: c.border,
        borderRadius: radius.lg,
        paddingHorizontal: 16,
        paddingVertical: 2,
      }}>
      {rows.map((r, i) => (
        <View
          key={r.label}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: r.emphasize ? 13 : 11,
            borderBottomWidth: i < rows.length - 1 ? 1 : 0,
            borderBottomColor: c.border,
          }}>
          {r.emphasize ? (
            <AppText variant="bodyStrong" color={c.text}>
              {r.label}
            </AppText>
          ) : (
            <AppText variant="body" dim style={{ fontSize: 13.5 }}>
              {r.label}
            </AppText>
          )}
          <AppText
            variant={r.emphasize ? 'monoLg' : r.plain ? 'body' : 'mono'}
            color={r.valueColor ?? (r.emphasize ? c.brand500 : c.text)}
            style={{ fontSize: r.emphasize ? 16 : 13.5 }}>
            {r.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}
