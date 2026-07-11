import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Block, FeatureGrid, CtaBand } from "@/components/marketing/blocks";
import { ROUTES, docs, STELLAR } from "@/lib/links";

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "The systems NordStern connects: Stellar rails and wallets, INR payment providers, Didit KYC, and your own product via SDK, REST APIs, and webhooks.",
  alternates: { canonical: ROUTES.integrations },
};

export default function IntegrationsPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Integrations"
        title="Connected to the rails that matter."
        lead="NordStern sits between fiat and Stellar, so it plugs into both worlds — payment rails and KYC on one side, wallets and settlement on the other, and your product in the middle. Every external dependency is a swappable adapter."
        primary={{ label: "Talk to us", href: ROUTES.contact }}
        secondary={{ label: "Read the API docs", href: docs("developers") }}
      />

      <Block eyebrow="Fiat & compliance" title="Money in, money out, verified">
        <FeatureGrid
          items={[
            { icon: "bank", title: "INR payment rails", body: "UPI, IMPS, NEFT, and RTGS through regulated partners for deposits and payouts.", href: docs("engineering/money-flow") },
            { icon: "users", title: "Didit KYC", body: "Document, liveness, and face-match verification tuned for India, behind a provider seam.", href: ROUTES.identity },
            { icon: "shield", title: "Compliance monitoring", body: "FIU-IND reporting and sanctions screening wired into every flow.", href: ROUTES.security },
          ]}
        />
      </Block>

      <Block tone="surface" eyebrow="Stellar & wallets" title="Settlement and the wallets your users trust">
        <FeatureGrid
          items={[
            { icon: "bolt", title: "Third-party wallets", body: "Lobstr, Vibrant, Freighter and any SEP-24 wallet open your anchor's interactive flow.", href: STELLAR.walletsKit },
            { icon: "layers", title: "Stellar settlement", body: "USDC and asset settlement on Stellar, with the Observer matching payments by memo.", href: STELLAR.horizon },
            { icon: "code", title: "Your product", body: "Embed anchor flows or build custom experiences with the unified SDK, REST APIs, and webhooks.", href: docs("developers") },
          ]}
        />
      </Block>

      <Block eyebrow="Don't see yours?" title="Adapters, not lock-in">
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          Because KYC, fiat-in, fiat-out, and banking all sit behind interfaces with
          mock defaults, adding a new provider is an adapter — not a rewrite. Tell us
          the rail or provider you need and we&apos;ll scope it with you.
        </p>
      </Block>

      <CtaBand title="Need a specific integration?" secondary={{ label: "Contact us", href: ROUTES.contact }} />
    </MarketingShell>
  );
}
