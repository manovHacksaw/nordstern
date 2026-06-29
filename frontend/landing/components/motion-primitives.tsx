"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/** Premium, slow ease — matches Apple/Linear deceleration curves. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll-linked section. Reveal and exit are both driven by the section's
 * progress through the viewport (not a one-shot trigger), so transitions
 * overlap: the previous section drifts up + fades as the next pushes in.
 */
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Smooth the raw scroll value for buttery, lag-free motion.
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  // enter [0 → 0.24] · hold · exit [0.78 → 1]
  const opacity = useTransform(p, [0, 0.24, 0.78, 1], [0, 1, 1, 0.85]);
  const y = useTransform(p, [0, 0.24, 0.78, 1], [110, 0, 0, -40]);
  const scale = useTransform(p, [0, 0.24, 0.78, 1], [0.97, 1, 1, 0.985]);

  if (reduce) {
    return (
      <section ref={ref} id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      style={{ opacity, y, scale, willChange: "transform, opacity" }}
    >
      {children}
    </motion.section>
  );
}

/**
 * Staggered container — for small in-section elements (heading → subtitle →
 * cards). whileInView per the spec; fires once.
 */
export function Stagger({
  children,
  className,
  delayChildren = 0.1,
  stagger = 0.09,
  amount = 0.3,
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  stagger?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { delayChildren, staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Single staggered item. `x` adds subtle horizontal drift for card rows
 * (left: -40, center: 0, right: 40).
 */
export function StaggerItem({
  children,
  className,
  x = 0,
}: {
  children: ReactNode;
  className?: string;
  x?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.96, x },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          x: 0,
          transition: { duration: 0.85, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parallax layer. Translates on the Y axis as the element scrolls through the
 * viewport. `speed` is the drift in px across the full pass (signed).
 */
export function Parallax({
  children,
  speed = 60,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const ys = useSpring(y, { stiffness: 90, damping: 30, mass: 0.5 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y: ys }}>{children}</motion.div>
    </div>
  );
}
