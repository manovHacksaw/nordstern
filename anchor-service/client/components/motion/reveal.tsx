'use client';

import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, DURATION } from './ease';

// Single scroll/mount reveal primitive: fade + directional travel. Reduced-motion safe.
export function Reveal({
  children, className, y = 24, x = 0, delay = 0, duration = DURATION.base,
  amount = 0.1, once = true,
}: {
  children: ReactNode; className?: string; y?: number; x?: number; delay?: number;
  duration?: number; amount?: number; once?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount, margin: '0px 0px -60px 0px' }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
