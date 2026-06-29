"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { EASE } from "@/components/motion-primitives";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  // Content drifts DOWN as the page scrolls up → it moves slower than scroll.
  const contentY = useTransform(p, [0, 1], [0, 120]);
  const contentOpacity = useTransform(p, [0, 1], [1, 0.82]);
  // Blobs move independently for depth.
  const blobY = useTransform(p, [0, 1], [0, 220]);
  const blobY2 = useTransform(p, [0, 1], [0, -120]);

  const motionContent = reduce ? {} : { y: contentY, opacity: contentOpacity };

  return (
    <main
      ref={ref}
      className="relative w-full px-4 sm:px-8 lg:px-12 pt-2 pb-10 flex flex-col items-center"
    >
      {/* drifting decorative blobs behind the card */}
      {!reduce && (
        <>
          <motion.div
            aria-hidden
            style={{ y: blobY }}
            className="pointer-events-none absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(171,159,242,0.45),transparent)] blur-3xl"
          />
          <motion.div
            aria-hidden
            style={{ y: blobY2 }}
            className="pointer-events-none absolute right-[10%] bottom-[8%] h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(139,126,224,0.35),transparent)] blur-3xl"
          />
        </>
      )}

      {/* dark hero card */}
      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative w-full max-w-[1400px] overflow-hidden rounded-[2rem] sm:rounded-[2.75rem] bg-black"
      >
        {/* content */}
        <motion.div
          style={motionContent}
          className="relative z-10 flex min-h-[560px] flex-col justify-between p-8 sm:p-12 lg:min-h-[660px] lg:p-16"
        >
          {/* top + giant */}
          <div className="flex flex-1 flex-col justify-center">
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              className="mb-1 text-xl font-normal tracking-tight text-white/85 sm:text-2xl"
            >
              Stellar infrastructure
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, ease: EASE, delay: 0.22 }}
              className="font-extrabold leading-[0.82] tracking-[-0.045em] text-white text-[clamp(5rem,19vw,16rem)]"
            >
              ANCHOR
            </motion.h1>
          </div>

          {/* bottom row: tagline + blurb/CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
            className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <p className="max-w-md text-[15px] text-white/70 sm:text-lg">
              Instant fiat rails, automated KYC, and built-in compliance.
            </p>

            <div className="max-w-sm space-y-6 lg:text-right">
              <p className="text-[15px] leading-snug text-white/85 sm:text-[17px] lg:ml-auto">
                Launch your anchor and grow on/off-ramp volume with instant fiat
                rails and precise compliance — engineered for the Stellar
                network.
              </p>

              <form className="w-full lg:ml-auto lg:max-w-sm">
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] p-1.5 pl-5 backdrop-blur-sm transition-colors focus-within:border-[#AB9FF2]/60">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    aria-label="Email address"
                    className="min-w-0 flex-1 bg-transparent text-left text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-[#AB9FF2] py-2 pl-4 pr-2 text-[#161616] transition-all duration-200 hover:bg-[#bcb1f6] active:scale-[0.98] cursor-pointer"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
                      Get early access
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#161616] text-white transition-transform duration-200 group-hover:rotate-45">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </button>
                </div>
                <p className="mt-2.5 text-xs text-white/40 lg:text-right">
                  Join the waitlist — no spam, just launch updates.
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}
