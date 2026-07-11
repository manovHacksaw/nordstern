import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Block, FeatureGrid, LinkList, CtaBand } from "@/components/marketing/blocks";
import { ROUTES, EXTERNAL, docs, STELLAR } from "@/lib/links";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How NordStern keeps funds and data safe: self-custodial by design, secrets never in the database, hash-chained audit logs, and compliance monitoring built into every flow.",
  alternates: { canonical: ROUTES.security },
};

export default function SecurityPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Trust & security"
        title="Secure by architecture, not by policy alone."
        lead="Money movement is asynchronous, status-driven, and auditable. Users keep custody of their own funds, secrets never touch the database, and every state transition is recorded on a tamper-evident trail."
        primary={{ label: "Read the security model", href: docs("getting-started/security-model") }}
        secondary={{ label: "Talk to us", href: ROUTES.contact }}
      />

      <Block eyebrow="Principles" title="How we keep funds and data safe">
        <FeatureGrid
          items={[
            { icon: "shield", title: "Self-custodial", body: "Assets stay in the user's own Stellar wallet. NordStern renders deposit and withdrawal flows but never holds user keys." },
            { icon: "bank", title: "Secrets isolated", body: "Signing seeds and PSP credentials live in a secrets manager, never in application databases or the repo." },
            { icon: "activity", title: "Tamper-evident audit", body: "A hash-chained audit log makes every compliance-relevant action defensible and replayable." },
            { icon: "users", title: "Identity you consent to", body: "KYC is completed once through Didit; sharing verified identity across flows is explicit and consented." },
            { icon: "layers", title: "Idempotent money moves", body: "Transfers are matched by memo and never blindly retried — duplicate settlement is designed out." },
            { icon: "code", title: "Config, not code, goes live", body: "Testnet is the default; moving real money is a deliberate, reviewed config change with webhook signature verification." },
          ]}
        />
      </Block>

      <Block tone="surface" eyebrow="Go deeper" title="Security & compliance references">
        <LinkList
          items={[
            { label: "Security model", href: docs("getting-started/security-model"), desc: "Threat model, custody boundary, and secrets architecture." },
            { label: "Compliance approach", href: docs("getting-started/compliance"), desc: "FIU-IND, sanctions screening, and monitoring." },
            { label: "Secrets handling", href: docs("engineering/secrets"), desc: "How signing and PSP credentials are stored and rotated." },
            { label: "Stellar SEP-10 authentication", href: STELLAR.sep(10), desc: "The wallet authentication protocol we rely on." },
            { label: "Report a vulnerability", href: `mailto:${EXTERNAL.support}`, desc: "Responsible disclosure — we respond quickly." },
          ]}
        />
      </Block>

      <CtaBand
        title="Have a security question?"
        secondary={{ label: "Email the team", href: `mailto:${EXTERNAL.support}` }}
      />
    </MarketingShell>
  );
}
