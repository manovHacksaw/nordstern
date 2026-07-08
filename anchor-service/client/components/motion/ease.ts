import type { Transition } from 'framer-motion';

// Premium deceleration curve (Apple/Linear feel) — shared everywhere. Mirrors the
// landing's motion language so the customer app feels like the same product family.
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.25,
  base: 0.55,
  slow: 0.9,
} as const;

export const baseTransition: Transition = { duration: DURATION.slow, ease: EASE };
