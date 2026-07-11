import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Block, FeatureGrid, LinkList, CtaBand } from "@/components/marketing/blocks";
import { ROUTES, docs, STELLAR } from "@/lib/links";

export const metadata: Metadata = {
  title: "Anchor Platform",
  description:
    "NordStern runs the Stellar Anchor Platform (SEP-1/10/12/24) for you — managed, monitored, and wired to a custom business server, INR rails, KYC, and treasury.",
  alternates: { canonical: ROUTES.anchorPlatform },
};

export default function AnchorPlatformPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Managed infrastructure"
        title="The Stellar Anchor Platform, run for you."
        lead="The Anchor Platform speaks the SEP protocols so wallets like Lobstr, Vibrant, and Freighter can deposit and withdraw against your anchor. We run it, monitor it, and wire it to your business logic — you never assemble the stack."
        primary={{ label: "Talk to us", href: ROUTES.contact }}
        secondary={{ label: "Stellar Anchor Platform docs", href: STELLAR.anchorPlatform }}
      />

      <Block eyebrow="What it speaks" title="The SEP protocols, handled">
        <FeatureGrid
          items={[
            { icon: "book", title: "SEP-1 — service discovery", body: "The stellar.toml file wallets fetch to discover your anchor's capabilities.", href: STELLAR.sep(1) },
            { icon: "shield", title: "SEP-10 — authentication", body: "Challenge/response wallet authentication that proves control of a Stellar account.", href: STELLAR.sep(10) },
            { icon: "users", title: "SEP-12 — KYC API", body: "The customer/KYC contract the platform uses to collect and check identity.", href: STELLAR.sep(12) },
            { icon: "bolt", title: "SEP-24 — interactive flow", body: "The hosted deposit/withdrawal experience wallets open in a webview. This is the active flow.", href: STELLAR.sep(24) },
          ]}
        />
      </Block>

      <Block tone="surface" eyebrow="Around the platform" title="Everything the protocol delegates">
        <FeatureGrid
          items={[
            { icon: "code", title: "Business server", body: "Answers the decisions the platform delegates: deposit addresses, fee quotes, customers, and status transitions.", href: docs("engineering/business-server") },
            { icon: "bank", title: "INR rails", body: "UPI, IMPS, NEFT and RTGS through regulated partners, reconciled to on-chain settlement.", href: docs("engineering/money-flow") },
            { icon: "chart", title: "Treasury & pricing", body: "Reserves, spread, and settlement controls built for margin.", href: "/#platform" },
            { icon: "grid", title: "Operator console", body: "Live transaction ops, compliance views, and treasury — one surface for your team.", href: docs("operator/dashboard") },
          ]}
        />
      </Block>

      <Block eyebrow="Go deeper" title="Platform references">
        <LinkList
          items={[
            { label: "Stellar Anchor Platform", href: STELLAR.anchorPlatform, desc: "Upstream documentation for the protocol server." },
            { label: "Running the stack", href: docs("engineering/running-the-stack"), desc: "How the connected platform comes up locally." },
            { label: "Ports & services", href: docs("engineering/ports-and-services"), desc: "Every service and where it listens." },
            { label: "Transaction statuses", href: docs("reference/transaction-statuses"), desc: "The state machine money moves through." },
          ]}
        />
      </Block>

      <CtaBand title="Launch on a platform that's already running." secondary={{ label: "Explore the SDK", href: docs("developers") }} />
    </MarketingShell>
  );
}
