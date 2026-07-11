/** Big centered amount entry (deposit "You pay", withdraw/cb amounts) + quick chips. */
import { TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Font } from '@/theme/fonts';
import { useTheme } from '@/theme/theme-context';

export type AmountChip = { label: string; value: string };

export function AmountInput({
  label,
  prefix,
  suffix,
  value,
  onChangeText,
  chips,
  onChip,
}: {
  label: string;
  prefix?: string;
  suffix?: string;
  value: string;
  onChangeText: (v: string) => void;
  chips?: AmountChip[];
  onChip?: (value: string) => void;
}) {
  const { c } = useTheme();
  return (
    <View style={{ paddingTop: 22, paddingBottom: 8 }}>
      <AppText dim style={{ fontSize: 13, textAlign: 'center' }}>
        {label}
      </AppText>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          marginTop: 8,
        }}>
        {prefix ? (
          <AppText color={c.text2} style={{ fontFamily: Font.monoSemibold, fontSize: 34 }}>
            {prefix}
          </AppText>
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          selectionColor={c.brand500}
          style={{
            minWidth: 120,
            color: c.text,
            fontFamily: Font.monoSemibold,
            fontSize: 44,
            textAlign: 'center',
            padding: 0,
          }}
        />
        {suffix ? (
          <AppText color={c.text2} style={{ fontFamily: Font.monoSemibold, fontSize: 20 }}>
            {suffix}
          </AppText>
        ) : null}
      </View>

      {chips && chips.length > 0 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          {chips.map((ch) => (
            <AppText
              key={ch.label}
              onPress={() => onChip?.(ch.value)}
              variant="mono"
              color={c.text}
              style={{
                fontSize: 13,
                backgroundColor: c.surface,
                borderWidth: 1,
                borderColor: c.border,
                borderRadius: 999,
                paddingVertical: 8,
                paddingHorizontal: 14,
                overflow: 'hidden',
              }}>
              {ch.label}
            </AppText>
          ))}
        </View>
      )}
    </View>
  );
}
