"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import { ArrowUpRight, ChevronRight, Grid, Bank, Chart } from "@/components/ui/icons";
import { EASE } from "@/components/motion/ease";
import {
  ConsoleDashboard,
  type ConsoleView,
} from "@/components/mockups/console-dashboard";
import { HERO } from "@/lib/content";

const TABS: { id: ConsoleView; label: string; Icon: typeof Grid }[] = [
  { id: "overview", label: "Overview", Icon: Grid },
  { id: "treasury", label: "Treasury", Icon: Bank },
  { id: "pricing", label: "Pricing", Icon: Chart },
];

/** Soft, concentrated aurora — brightest behind the dashboard's right edge. */
function HeroGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute right-[-14%] top-[36%] size-[46rem] rounded-full opacity-35 blur-[150px] [animation:aurora-drift_26s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(closest-side, var(--color-brand-200), transparent)" }}
      />
      <div
        className="absolute right-[2%] top-[58%] size-[26rem] rounded-full opacity-25 blur-[140px]"
        style={{ background: "radial-gradient(closest-side, var(--color-aurora-cyan), transparent)" }}
      />
      <div
        className="absolute left-[-12%] top-[6%] size-[30rem] rounded-full opacity-20 blur-[150px]"
        style={{ background: "radial-gradient(closest-side, var(--color-brand-100), transparent)" }}
      />
    </div>
  );
}

export function Hero() {
  const [view, setView] = useState<ConsoleView>("overview");
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-40 lg:pb-24">
      <HeroGlow />
      <Container>
        {/* headline row */}
        <div className="grid gap-y-8 lg:grid-cols-[1.35fr_0.85fr] lg:items-start lg:gap-x-12">
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
            <Heading as="h1" size="display" className="mt-7 text-ink text-wrap">
              {HERO.title}
            </Heading>
          </div>

          <div className="lg:pt-1.5">
            <p className="max-w-[30rem] text-[17px] leading-[1.6] text-ink/75">
              {HERO.lead}
            </p>
            <div className="mt-8 flex items-center gap-7">
              <Button href={HERO.primary.href} variant="primary" className="h-12 px-7">
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
        </div>

        {/* tab switcher */}
        <div className="mt-24 flex justify-center lg:mt-28">
          <div
            role="tablist"
            aria-label="Console view"
            className="inline-flex items-center gap-1 rounded-pill border border-line bg-white/80 p-1 shadow-[0_2px_12px_rgba(20,20,43,0.06)] backdrop-blur"
          >
            {TABS.map(({ id, label, Icon }) => {
              const active = view === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setView(id)}
                  className="relative flex items-center gap-2 rounded-pill px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  {active && (
                    <motion.span
                      layoutId="hero-tab-pill"
                      className="absolute inset-0 -z-10 rounded-pill bg-ink"
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                  )}
                  <Icon className={active ? "text-base text-white" : "text-base text-subtle"} />
                  <span className={active ? "text-white" : "text-muted"}>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* dashboard */}
        <div className="relative mt-7">
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
