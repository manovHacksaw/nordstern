/**
 * Theme context. Dark is the default; the Settings "Light theme" switch flips it.
 * (The design ignores the OS scheme and ships dark-first, so we don't read
 * `useColorScheme` here — the user's explicit choice is authoritative.)
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { dark, light, motion, radius, shadowMd, shadowSm, space, type ColorTokens } from '@/constants/tokens';

export type ThemeMode = 'dark' | 'light';

type ThemeValue = {
  mode: ThemeMode;
  isDark: boolean;
  c: ColorTokens;
  radius: typeof radius;
  space: typeof space;
  shadowMd: typeof shadowMd;
  shadowSm: typeof shadowSm;
  motion: typeof motion;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children, initial = 'dark' }: { children: ReactNode; initial?: ThemeMode }) {
  const [mode, setMode] = useState<ThemeMode>(initial);

  const toggle = useCallback(() => setMode((m) => (m === 'dark' ? 'light' : 'dark')), []);

  const value = useMemo<ThemeValue>(
    () => ({
      mode,
      isDark: mode === 'dark',
      c: mode === 'dark' ? dark : light,
      radius,
      space,
      shadowMd,
      shadowSm,
      motion,
      setMode,
      toggle,
    }),
    [mode, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}
