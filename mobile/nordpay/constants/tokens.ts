/**
 * Design tokens for the Stellar Anchor Wallet (nordpay).
 * Values are authoritative — copied verbatim from the design handoff
 * (`design_handoff_stellar_anchor_wallet/README.md` — Design Tokens).
 *
 * Perano purple accent on a near-black canvas; a monospace face for every number.
 */

export type ColorTokens = {
  // surfaces
  canvas: string;
  surface: string;
  surface2: string;
  border: string;
  // text
  text: string;
  text2: string;
  text3: string;
  // brand (Perano)
  brand50: string;
  brand100: string;
  brand300: string;
  brand500: string; // primary
  brand700: string; // hover / press
  brand900: string; // deep fills / gradient end
  brandText: string; // brand text tuned for the active theme's contrast
  // semantic
  success: string;
  successFill: string;
  warning: string;
  warningFill: string;
  error: string;
  errorFill: string;
  info: string;
  infoFill: string;
  overlay: string;
};

export const dark: ColorTokens = {
  canvas: '#1A1A1A',
  surface: '#211F29',
  surface2: '#2A2733',
  border: 'rgba(152,151,156,0.24)',

  text: '#FFFFFF',
  text2: '#98979C',
  text3: 'rgba(152,151,156,0.6)',

  brand50: '#F5F2FF',
  brand100: '#E2DFFE',
  brand300: '#C7BEF7',
  brand500: '#AB9FF2',
  brand700: '#8B7EE0',
  brand900: '#3C315B',
  brandText: '#AB9FF2',

  success: '#2EC08B',
  successFill: 'rgba(46,192,139,0.16)',
  warning: '#F2B84B',
  warningFill: 'rgba(242,184,75,0.16)',
  error: '#FF4444',
  errorFill: 'rgba(255,68,68,0.16)',
  info: '#7DB8F2',
  infoFill: 'rgba(125,184,242,0.16)',
  overlay: 'rgba(0,0,0,0.8)',
};

export const light: ColorTokens = {
  canvas: '#FFFFFF',
  surface: '#F5F2FF',
  surface2: '#E2DFFE',
  border: 'rgba(60,49,91,0.12)',

  text: '#1A1A1A',
  text2: '#6B6770',
  text3: 'rgba(60,49,91,0.5)',

  brand50: '#F5F2FF',
  brand100: '#E2DFFE',
  brand300: '#C7BEF7',
  brand500: '#AB9FF2',
  brand700: '#8B7EE0',
  brand900: '#3C315B',
  brandText: '#8B7EE0', // AA contrast on light

  success: '#1F9D74',
  successFill: 'rgba(46,192,139,0.16)',
  warning: '#B97A1B',
  warningFill: 'rgba(242,184,75,0.16)',
  error: '#D92D2D',
  errorFill: 'rgba(255,68,68,0.16)',
  info: '#3B6FD1',
  infoFill: 'rgba(125,184,242,0.16)',
  overlay: 'rgba(0,0,0,0.8)',
};

/** Corner radii. sm chips · md inputs/method cards/secondary buttons · lg cards · xl hero · full pills/avatars/primary buttons. */
export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
} as const;

/** 4px spacing scale. */
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  gutter: 18,
} as const;

/** Purple-tinted (Martinique) elevation. RN shadow (iOS) + elevation (Android). */
export const shadowMd = {
  shadowColor: '#3C315B',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.16,
  shadowRadius: 24,
  elevation: 8,
} as const;

export const shadowSm = {
  shadowColor: '#3C315B',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 2,
} as const;

/** Motion durations (ms) and standard easing bezier control points. */
export const motion = {
  fast: 120,
  base: 200,
  slow: 320,
  standard: [0.4, 0, 0.2, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
};
