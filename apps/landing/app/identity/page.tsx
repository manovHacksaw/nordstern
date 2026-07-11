import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Block, FeatureGrid, LinkList, CtaBand } from "@/components/marketing/blocks";
import { ROUTES, docs, STELLAR } from "@/lib/links";

export const metadata: Metadata = {
  title: "Identity",
  description:
    "NordStern Identity: verify once with Didit, prove wallet ownership, and reuse a consented identity across every anchor flow — liveness, face-match, and deepfake checks tuned for India.",
  alternates: { canonical: ROUTES.identity },
};

export default function IdentityPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Identity & KYC"
        title="Verify once. Prove ownership. Reuse with consent."
        lead="Users complete document, liveness, and face-match verification once through Didit. That verified identity — and the wallets a user has proven they control — can be reused across flows, always with explicit consent."
        primary={{ label: "Talk to us", href: ROUTES.contact }}
        secondary={{ label: "How KYC works", href: docs("getting-started/concepts") }}
      />

      <Block eyebrow="The model" title="Identity, credentials, and proven wallets">
        <FeatureGrid
          items={[
            { icon: "users", title: "NordStern Identity", body: "A first-class identity a person owns — the anchor point for authenticators, credentials, and proven wallets." },
            { icon: "shield", title: "Verified once with Didit", body: "Document, liveness, face-match, and deepfake checks, tuned for Tier 2/3 India — not repeated on every flow." },
            { icon: "bank", title: "Proven wallets", body: "Users cryptographically prove control of their Stellar wallets; funds never leave the wallet they already trust." },
            { icon: "layers", title: "Consented reuse", body: "Sharing a verified identity across anchors is explicit and consented — the boundary is designed in, not assumed." },
            { icon: "activity", title: "Tiered authorization", body: "Authenticators versus signing capabilities are separated, so different actions require the right level of proof." },
            { icon: "code", title: "Swappable provider", body: "KYC sits behind a KycProvider interface — Didit today, another provider tomorrow, without touching core flows." },
          ]}
        />
      </Block>

      <Block tone="surface" eyebrow="Go deeper" title="Identity references">
        <LinkList
          items={[
            { label: "Concepts & KYC flow", href: docs("getting-started/concepts"), desc: "How verification fits into deposit and withdrawal." },
            { label: "Compliance approach", href: docs("getting-started/compliance"), desc: "FIU-IND, sanctions, and monitoring." },
            { label: "Stellar SEP-12 (KYC API)", href: STELLAR.sep(12), desc: "The customer/KYC protocol the platform implements." },
            { label: "Stellar SEP-10 (authentication)", href: STELLAR.sep(10), desc: "Wallet authentication used to prove ownership." },
          ]}
        />
      </Block>

      <CtaBand title="Give your users a verify-once experience." />
    </MarketingShell>
  );
}
