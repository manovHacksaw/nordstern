import { type ReactNode } from "react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

/**
 * Chrome for every sub-route: the same fixed Navbar and Footer as the homepage,
 * with a <main> that clears the fixed header. Keeps every page cohesive so a
 * visitor can browse the whole site without leaving the design language.
 */
export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="top" className="pt-[72px] lg:pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
