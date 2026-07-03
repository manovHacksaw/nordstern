"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import {
  ArrowUpRight,
  ChevronRight,
  Grid,
  Bank,
  Chart,
} from "@/components/ui/icons";
import { EASE } from "@/components/motion/ease";
import {
  ConsoleDashboard,
  type ConsoleView,
} from "@/components/mockups/console-dashboard";
import { HERO } from "@/lib/content";
import {
  GooglePlayButton,
  AppStoreButton,
} from "@/components/base/buttons/app-store-buttons";

const TABS: { id: ConsoleView; label: string; Icon: typeof Grid }[] = [
  { id: "overview", label: "Overview", Icon: Grid },
  { id: "treasury", label: "Treasury", Icon: Bank },
  { id: "pricing", label: "Pricing", Icon: Chart },
];

/** Soft, concentrated aurora — brightest behind the dashboard's right edge. */
function HeroGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute right-[-14%] top-[36%] size-[46rem] rounded-full opacity-35 blur-[150px] [animation:aurora-drift_26s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-brand-200), transparent)",
        }}
      />
      <div
        className="absolute right-[2%] top-[58%] size-[26rem] rounded-full opacity-25 blur-[140px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-aurora-cyan), transparent)",
        }}
      />
      <div
        className="absolute left-[-12%] top-[6%] size-[30rem] rounded-full opacity-20 blur-[150px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-brand-100), transparent)",
        }}
      />
    </div>
  );
}

export function Hero() {
  const [view, setView] = useState<ConsoleView>("overview");
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-48 pb-16 sm:pt-66 lg:pb-24 font-clear-display">
      <HeroGlow />
      <Container>
        {/* headline row */}
        <div className=" grid gap-y-8  lg:grid-cols-[1.35fr_0.85fr] lg:items-start lg:gap-x-12 font-clear-display">
          <div>
            <Link href={HERO.eyebrow.href} className="group inline-block">
              <Badge
                variant="outline"
                className="gap-2 px-4 py-2.5 text-[13px] shadow-[0_1px_2px_rgba(20,20,43,0.04)] transition-colors group-hover:bg-surface"
              >
                {HERO.eyebrow.label}
                <ArrowUpRight className="text-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Badge>
            </Link>
            <Heading
              as="h1"
              size="display"
              className="mt-7 font-clear-display text-[clamp(2.6rem,6.4vw,5rem)] leading-[1.02] text-ink text-wrap"
            >
              {HERO.title}
            </Heading>
          </div>

          {/* code snippet */}
          <div className="lg:pt-45 lg:pl-19">
            <p className="max-w-[32rem] text-[17px] leading-[1.6] text-ink/75 font-clear-display">
              {HERO.lead}
            </p>
          </div>
        </div>

        {/* app badges (left) + CTAs (right) */}
        <div className="mt-20 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between lg:mt-14">
          <div className="flex items-center gap-3">
            <GooglePlayButton size="lg" />
            <AppStoreButton size="lg" />
          </div>

          <div className="flex items-center gap-7 font-clear-display">
            <Button
              href={HERO.primary.href}
              variant="primary"
              className="h-12 px-7"
            >
              {HERO.primary.label}
            </Button>

            <Link
              href={HERO.secondary.href}
              className="group inline-flex items-center gap-1 text-[15px] font-medium text-ink"
            >
              <span className="underline decoration-line decoration-1 underline-offset-[5px] transition-colors group-hover:decoration-ink">
                {HERO.secondary.label}
              </span>

              <ChevronRight className="text-subtle transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* dashboard */}
        <div className="relative mt-7 lg:-mx-10 lg:mt-6 xl:-mx-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <ConsoleDashboard view={view} />
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
