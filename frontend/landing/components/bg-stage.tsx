"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Fixed backdrop behind all content. The page background colour interpolates
 * smoothly across the whole scroll, and two soft purple blobs drift at
 * different speeds to create depth. Sections sit transparent on top of this.
 */
export function BgStage() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    mass: 0.5,
  });

  // White at the hero → warming lavender through the body, no hard cuts.
  const background = useTransform(
    p,
    [0, 0.4, 0.72, 1],
    ["#ffffff", "#f6f3ff", "#efeaff", "#f4efff"],
  );

  const blobA = useTransform(p, [0, 1], [0, 340]);
  const blobB = useTransform(p, [0, 1], [0, -240]);
  const blobC = useTransform(p, [0, 1], [0, 180]);

  return (
    <motion.div
      aria-hidden
      style={{ backgroundColor: background }}
      className="fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        style={{ y: blobA }}
        className="absolute -left-40 top-[18%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(171,159,242,0.30),transparent)] blur-3xl"
      />
      <motion.div
        style={{ y: blobB }}
        className="absolute right-[-12%] top-[42%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(closest-side,rgba(139,126,224,0.22),transparent)] blur-3xl"
      />
      <motion.div
        style={{ y: blobC }}
        className="absolute left-[30%] bottom-[6%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(closest-side,rgba(199,190,247,0.28),transparent)] blur-3xl"
      />
    </motion.div>
  );
}
