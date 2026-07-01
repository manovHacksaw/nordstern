import type { Transition, Variants } from "framer-motion";

/** Premium deceleration curve (Apple/Linear feel). Shared everywhere. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.25,
  base: 0.5,
  slow: 0.8,
} as const;

export const baseTransition: Transition = {
  duration: DURATION.slow,
  ease: EASE,
};

/** Fade + rise, used by Reveal / StaggerItem. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: baseTransition },
};
