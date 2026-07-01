"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ChevronRight } from "@/components/ui/icons";
import { MegaMenu } from "./mega-menu";
import { EASE } from "@/components/motion/ease";
import { cn } from "@/lib/cn";
import { NAV } from "@/lib/content";

export function Navbar() {
  const [open, setOpen] = useState(false); // mobile sheet
  const [active, setActive] = useState<string | null>(null); // mega menu
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  /** Small delay on first open; instant switch once a menu is already open. */
  const openMenu = (label: string) => {
    cancelClose();
    if (openTimer.current) clearTimeout(openTimer.current);
    if (active) {
      setActive(label);
      return;
    }
    openTimer.current = setTimeout(() => setActive(label), 120);
  };
  const scheduleClose = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 160);
  };

  const activeItem = NAV.find((n) => n.label === active);

  return (
    <header className="fixed inset-x-0 top-0 z-50" onMouseLeave={scheduleClose}>
      <div
        className={cn(
          "relative border-b border-line backdrop-blur-md transition-colors duration-200",
          active ? "bg-white" : "bg-white/80",
        )}
      >
        <Container className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-16">
            <Link href="#top" aria-label="NordStern home">
              <Logo />
            </Link>
            <nav className="hidden items-center gap-8 md:flex">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => openMenu(item.label)}
                  onFocus={() => openMenu(item.label)}
                  aria-expanded={active === item.label}
                  className={cn(
                    "flex h-20 items-center text-[15px] font-medium transition-colors",
                    active === item.label ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="#"
              className="text-[15px] font-medium text-muted transition-colors hover:text-ink"
            >
              Sandbox
            </Link>
            <Button href="#cta" variant="ghost" className="h-11 gap-1.5 pl-5 pr-4">
              Talk to us
              <ChevronRight className="text-subtle" />
            </Button>
          </div>

          {/* mobile toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center md:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute left-0 top-0 h-0.5 w-5 bg-ink transition-transform",
                  open && "translate-y-[5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 w-5 bg-ink transition-transform",
                  open && "-translate-y-[5px] -rotate-45",
                )}
              />
            </span>
          </button>
        </Container>

        {/* mega-menu panel — natural extension of the navbar */}
        <AnimatePresence>
          {activeItem && (
            <motion.div
              key="mega-panel"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: EASE }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_28px_50px_-28px_rgba(20,20,43,0.22)] md:block"
            >
              <Container className="py-9">
                <motion.div
                  key={activeItem.label}
                  initial={reduce ? false : { opacity: 0.35 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.16, ease: EASE }}
                >
                  <MegaMenu menu={activeItem.menu} />
                </motion.div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* mobile sheet */}
      {open && (
        <Container className="border-b border-line bg-white py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink hover:bg-surface"
              >
                {l.label}
              </Link>
            ))}
            <Button href="#cta" variant="primary" size="sm" className="mt-2 w-full">
              Talk to us
            </Button>
          </nav>
        </Container>
      )}
    </header>
  );
}
