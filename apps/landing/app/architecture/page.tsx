import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Block, FeatureGrid, LinkList, CtaBand } from "@/components/marketing/blocks";
import { ROUTES, docs, STELLAR } from "@/lib/links";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "How NordStern is built: the Stellar Anchor Platform owns the protocol, our business server owns the decisions, and every external dependency (KYC, fiat rails, banking) is a swappable adapter.",
  alternates: { canonical: ROUTES.architecture },
};

export default function ArchitecturePage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Architecture"
        title="The platform owns the protocol. Your business logic stays yours."
        lead="NordStern runs the Stellar Anchor Platform for SEP-1/10/12/24, a TypeScript business server for the decisions it delegates, and a control plane that provisions a dedicated stack per anchor. Every external rail is an adapter behind an interface."
        primary={{ label: "Read the architecture docs", href: docs("engineering/architecture") }}
        secondary={{ label: "See the platform", href: "/#platform" }}
      />

      <Block eyebrow="The layers" title="What runs, and who owns it">
        <FeatureGrid
          items={[
            { icon: "layers", title: "Anchor Platform", body: "The upstream Stellar Anchor Platform handles SEP-1/10/12/24. We never reimplement the protocol.", href: STELLAR.anchorPlatform },
            { icon: "code", title: "Business server", body: "A TypeScript/Express service answers the decisions the Platform delegates: addresses, fees, customers, and status.", href: docs("engineering/business-server") },
            { icon: "grid", title: "Control plane", body: "Provisions keypairs, assets, per-anchor databases, and containers — the seed of multi-tenant onboarding.", href: docs("engineering/control-plane") },
            { icon: "bank", title: "Fiat rails adapter", body: "UPI/IMPS collections and payouts sit behind a provider interface with a mock default.", href: docs("engineering/money-flow") },
            { icon: "users", title: "Identity & KYC", body: "Didit verification behind a KycProvider seam; identity is proven, consented, and reusable.", href: ROUTES.identity },
            { icon: "activity", title: "Observer & ledger", body: "The Stellar Observer matches on-chain payments by memo; state is authoritative in the Platform DB.", href: docs("reference/transaction-statuses") },
          ]}
        />
      </Block>

      <Block tone="surface" eyebrow="Principles" title="Why it's built this way">
        <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-muted">
          <p>
            The legal and banking model for Indian anchors is still settling, so
            everything external — KYC, fiat-in, fiat-out, custody — is a swappable
            adapter with a working mock default. A concrete vendor never leaks into
            core flow logic.
          </p>
          <p>
            Money movement is asynchronous and status-driven: state lives in the
            Platform database and is advanced by Platform API patches and the
            Observer, not by blocking request/response. Testnet is the default;
            going live is a deliberate config change.
          </p>
        </div>
      </Block>

      <Block eyebrow="Go deeper" title="Engineering references">
        <LinkList
          items={[
            { label: "Architecture overview", href: docs("engineering/architecture-overview"), desc: "Services, ports, and data flow." },
            { label: "Money flow", href: docs("engineering/money-flow"), desc: "How a deposit and withdrawal move end to end." },
            { label: "Multi-tenancy", href: docs("engineering/multi-tenancy"), desc: "How one anchor generalises to many." },
            { label: "Stellar Anchor Platform", href: STELLAR.anchorPlatform, desc: "The upstream protocol server we run." },
            { label: "SEP-24 (interactive deposit/withdraw)", href: STELLAR.sep(24), desc: "The active flow the platform renders." },
          ]}
        />
      </Block>

      <CtaBand title="Build on the platform." secondary={{ label: "Explore the SDK", href: docs("developers") }} />
    </MarketingShell>
  );
}
