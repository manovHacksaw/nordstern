'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Expo-out easing — matches the --ease-out-expo design token.
const EASE = [0.22, 1, 0.36, 1] as const;

// SSR-safe reveal: the server (and the first client paint) render the *resting* state
// (`initial={false}`, no injected styles), so hydration always matches. After mount we
// trigger the enter animation client-side. Reduced-motion → no animation at all. This
// avoids the useReducedMotion() server(null)/client hydration divergence.
function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => { setM(true); }, []);
  return m;
}

export function FadeUp({
  children, className, delay = 0, y = 12,
}: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const animate = mounted && !reduce ? { opacity: [0, 1], y: [y, 0] } : { opacity: 1, y: 0 };
  return (
    <motion.div className={className} initial={false} animate={animate} transition={{ duration: 0.5, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

/** Staggered container — direct <StaggerItem> children fade/rise in sequence after mount. */
export function Stagger({
  children, className, delay = 0, gap = 0.06,
}: { children: ReactNode; className?: string; delay?: number; gap?: number }) {
  const mounted = useMounted();
  return (
    <motion.div
      className={className}
      initial={false}
      animate={mounted ? 'show' : 'rest'}
      variants={{ show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      variants={reduce
        ? { rest: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
        : { rest: { opacity: 1, y: 0 }, show: { opacity: [0, 1], y: [12, 0], transition: { duration: 0.5, ease: EASE } } }}
    >
      {children}
    </motion.div>
  );
}
