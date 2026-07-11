import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, ComingSoon } from "@/components/marketing/blocks";
import { ROUTES } from "@/lib/links";

export const metadata: Metadata = {
  title: "Customers",
  description:
    "Case studies from anchors launching INR ↔ USDC ramps on NordStern — fintechs, wallets, and exchanges going live in weeks, not quarters. Stories coming soon.",
  alternates: { canonical: ROUTES.customers },
};

export default function CustomersPage() {
  return (
    <MarketingShell>
      <PageHero
        badge="Case studies coming soon"
        title="Anchors, live in weeks."
        lead="We're onboarding our first anchors now. As they launch, we'll publish how they went from license and bank relationship to a working INR ↔ USDC ramp — and what it meant for their business."
        primary={{ label: "Become a case study", href: ROUTES.contact }}
        secondary={{ label: "Who it's for", href: "/#audiences" }}
      />

      <ComingSoon
        what="Real stories from fintechs, wallets, and exchanges that launched a compliant Stellar anchor on NordStern — scope, timeline, rails used, and outcomes."
        why="Infrastructure claims are cheap; shipped launches aren't. We'd rather show anchors in production than publish logos without substance."
        coming={[
          "Fintech: embedding an INR on-ramp inside an existing product",
          "Wallet: adding USDC balances and instant off-ramp",
          "Exchange: a compliant INR deposit/withdrawal gateway",
          "Time-to-first-transaction and ops-overhead benchmarks",
        ]}
        audience="Teams evaluating NordStern who want proof from comparable launches before committing."
        cta={{ label: "Talk to us about launching", href: ROUTES.contact }}
      />
    </MarketingShell>
  );
}
