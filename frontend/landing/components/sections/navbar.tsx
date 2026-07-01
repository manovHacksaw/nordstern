"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ChevronRight } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { NAV_LINKS } from "@/lib/content";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-white/70 backdrop-blur-md">
      <Container className="flex h-[72px] items-center justify-between">
        <div className="flex items-center gap-9">
          <Link href="#top" aria-label="NordStern home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[15px] font-medium text-muted transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <Link href="#" className="text-[15px] font-medium text-muted transition-colors hover:text-ink">
            Sandbox
          </Link>
          <Button href="#cta" variant="ghost" className="h-10 gap-1.5 pl-5 pr-4">
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

      {/* mobile sheet */}
      {open && (
        <Container className="border-t border-line py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
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
