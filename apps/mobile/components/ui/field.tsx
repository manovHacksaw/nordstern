/** Labeled text field — a stacked label over a TextInput on a surface card. */
import { useState } from 'react';
import { TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { AppText } from './text';
import { useTheme } from '@/theme/theme-context';
import { Font } from '@/theme/fonts';

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  editable = true,
  mono,
}: {
  label: string;
  value?: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
  mono?: boolean;
}) {
  const { c, radius } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={{
        backgroundColor: c.surface,
        borderWidth: 1,
        borderColor: focused ? c.brand500 : c.border,
        borderRadius: radius.md,
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 8,
      }}>
      <AppText variant="label" dim3>
        {label}
      </AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.text3}
        keyboardType={keyboardType}
        editable={editable}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          color: c.text,
          fontFamily: mono ? Font.mono : Font.body,
          fontSize: 15,
          paddingVertical: 4,
          paddingHorizontal: 0,
        }}
      />
    </View>
  );
}
