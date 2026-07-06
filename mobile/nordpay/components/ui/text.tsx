/**
 * Typed text presets mapping the design's type scale to font roles.
 * Numeric variants (`mono*`) use JetBrains Mono; everything else Inter.
 */
import { Text, type TextProps, type TextStyle } from 'react-native';

import { Font } from '@/theme/fonts';
import { useTheme } from '@/theme/theme-context';

export type TextVariant =
  | 'display' // total balance — mono 42/600
  | 'h1' // screen title — 26/600
  | 'h3' // detail header — 22/600
  | 'title' // section title — 15.5/600
  | 'body'
  | 'bodyStrong'
  | 'caption' // 12, secondary
  | 'label' // 11, secondary
  | 'mono'
  | 'monoStrong'
  | 'monoLg'; // 16/600, brand figures

type Spec = { fontFamily: string; fontSize: number; letterSpacing?: number; lineHeight?: number };

const SPECS: Record<TextVariant, Spec> = {
  display: { fontFamily: Font.monoSemibold, fontSize: 42, letterSpacing: -0.42 },
  h1: { fontFamily: Font.display, fontSize: 26, letterSpacing: -0.52 },
  h3: { fontFamily: Font.display, fontSize: 22 },
  title: { fontFamily: Font.bodySemibold, fontSize: 15.5 },
  body: { fontFamily: Font.body, fontSize: 14 },
  bodyStrong: { fontFamily: Font.bodySemibold, fontSize: 14 },
  caption: { fontFamily: Font.body, fontSize: 12 },
  label: { fontFamily: Font.body, fontSize: 11 },
  mono: { fontFamily: Font.mono, fontSize: 13 },
  monoStrong: { fontFamily: Font.monoMedium, fontSize: 13 },
  monoLg: { fontFamily: Font.monoSemibold, fontSize: 16 },
};

const SECONDARY: TextVariant[] = ['caption', 'label'];

export function AppText({
  variant = 'body',
  color,
  dim,
  dim3,
  style,
  ...rest
}: TextProps & {
  variant?: TextVariant;
  color?: string;
  /** use secondary text color */
  dim?: boolean;
  /** use tertiary text color */
  dim3?: boolean;
}) {
  const { c } = useTheme();
  const spec = SPECS[variant];
  const resolved = color ?? (dim3 ? c.text3 : dim || SECONDARY.includes(variant) ? c.text2 : c.text);
  const base: TextStyle = { ...spec, color: resolved };
  return <Text {...rest} style={[base, style]} />;
}
