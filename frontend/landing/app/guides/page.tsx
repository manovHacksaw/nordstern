import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Block, LinkList, CtaBand } from "@/components/marketing/blocks";
import { ROUTES, docs, STELLAR } from "@/lib/links";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Practical guides for anchor operators — getting started, SEP flows, KYC, compliance, and running the stack. The full guide library lives in the NordStern docs.",
  alternates: { canonical: ROUTES.guides },
};

export default function GuidesPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Guides"
        title="How-tos for anchor operators."
        lead="Step-by-step guides for launching and running your anchor. The full, versioned library lives in the docs — here are the ones teams start with."
        primary={{ label: "Open the docs", href: docs() }}
        secondary={{ label: "Talk to us", href: ROUTES.contact }}
      />

      <Block eyebrow="Getting started" title="Your first anchor">
        <LinkList
          items={[
            { label: "Core concepts", href: docs("getting-started/concepts"), desc: "Anchors, SEPs, and how ramps work." },
            { label: "First anchor walkthrough", href: docs("engineering/first-anchor-walkthrough"), desc: "From zero to a working deposit on testnet." },
            { label: "Running the stack", href: docs("engineering/running-the-stack"), desc: "Bring up the connected platform locally." },
          ]}
        />
      </Block>

      <Block tone="surface" eyebrow="Operating" title="Run it well">
        <LinkList
          items={[
            { label: "Operator dashboard", href: docs("operator/dashboard"), desc: "Day-to-day transaction ops and monitoring." },
            { label: "Pricing & fees", href: docs("operator/pricing-and-fees"), desc: "Configure spread and settlement." },
            { label: "Compliance", href: docs("getting-started/compliance"), desc: "FIU-IND, sanctions, and monitoring." },
            { label: "Transaction statuses", href: docs("reference/transaction-statuses"), desc: "The state machine money moves through." },
          ]}
        />
      </Block>

      <Block eyebrow="Protocol" title="Understand the SEPs">
        <LinkList
          items={[
            { label: "SEP-24 — interactive deposit/withdraw", href: STELLAR.sep(24), desc: "The active flow the platform renders." },
            { label: "SEP-10 — authentication", href: STELLAR.sep(10), desc: "How wallets authenticate against your anchor." },
            { label: "SEP-12 — KYC API", href: STELLAR.sep(12), desc: "The customer/KYC contract." },
            { label: "Stellar Anchor Platform", href: STELLAR.anchorPlatform, desc: "Upstream reference for the protocol server." },
          ]}
        />
      </Block>

      <CtaBand title="Ready to build?" secondary={{ label: "Explore the SDK", href: docs("developers") }} />
    </MarketingShell>
  );
}
