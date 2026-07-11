/**
 * Font roles for the wallet.
 *
 * - display / headings: General Sans (unavailable on Google Fonts) → Inter 600 fallback,
 *   which the handoff explicitly allows.
 * - body / UI: Inter.
 * - numeric (balances, amounts, addresses, %, rates, codes, timestamps): JetBrains Mono —
 *   used everywhere a figure must read as exact.
 */
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInter,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
} from '@expo-google-fonts/jetbrains-mono';

/** Resolved family names to pass to `fontFamily`. */
export const Font = {
  display: 'Inter_600SemiBold', // General Sans fallback
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
  monoSemibold: 'JetBrainsMono_600SemiBold',
} as const;

/** Loads every font role. Returns true once ready. Gate app render on this. */
export function useAppFonts(): boolean {
  const [loaded] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
  });
  return loaded;
}
