import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Block, Steps, CtaBand } from "@/components/marketing/blocks";
import { ROUTES, docs } from "@/lib/links";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "The NordStern roadmap: from one anchor on testnet to a multi-anchor platform — real rails behind adapters, operator productization, multi-tenancy, and go-live hardening.",
  alternates: { canonical: ROUTES.roadmap },
};

export default function RoadmapPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Product roadmap"
        title="From one anchor, done well, to a platform of many."
        lead="We build in phases, and each phase assumes the seams from the last. Here's where we are and where we're heading."
        primary={{ label: "Read the full roadmap", href: docs("getting-started/roadmap") }}
        secondary={{ label: "Talk to us", href: ROUTES.contact }}
      />

      <Block eyebrow="Phases" title="How the platform grows">
        <Steps
          items={[
            { title: "Foundation — one anchor on testnet", body: "SEP-24 deposit mints tokens, withdrawals are detected, KYC and fiat are mocked behind adapters. The end-to-end flow works." },
            { title: "Real rails behind adapters", body: "Live KYC (Didit), UPI collection for deposits, and payout rails for withdrawals — still sandbox, with real webhook verification." },
            { title: "Operator productization", body: "Converge the operator console: treasury, fees and spread configuration, transaction ops, and compliance views driven by live data." },
            { title: "Multi-anchor", body: "Promote the control plane from a seed to real tenanting — assets, keys, and transactions scoped per anchor, with subdomain launch." },
            { title: "Go-live hardening", body: "Mainnet, a custody and banking model chosen with counsel, production infrastructure, monitoring, and incident runbooks." },
          ]}
        />
      </Block>

      <Block tone="surface" eyebrow="A note on sequencing" title="We don't skip ahead">
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          Each phase depends on the seams built in the earlier ones. Compliance and
          banking are open questions we resolve with qualified counsel, not in code —
          so timelines flex around real regulatory milestones rather than fixed dates.
        </p>
      </Block>

      <CtaBand title="Want to shape the roadmap?" body="Early anchor partners help us prioritise." />
    </MarketingShell>
  );
}
