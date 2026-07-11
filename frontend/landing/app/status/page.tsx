import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Block, CtaBand } from "@/components/marketing/blocks";
import { ROUTES, EXTERNAL, STELLAR } from "@/lib/links";

export const metadata: Metadata = {
  title: "Status",
  description:
    "NordStern system status — the operational state of the anchor platform, payment rails, KYC, and settlement components.",
  alternates: { canonical: ROUTES.status },
};

const COMPONENTS = [
  { name: "Anchor Platform (SEP servers)", state: "Operational" },
  { name: "Business server & control plane", state: "Operational" },
  { name: "INR payment rails", state: "Operational" },
  { name: "KYC & identity (Didit)", state: "Operational" },
  { name: "Stellar settlement & Observer", state: "Operational" },
  { name: "Operator console", state: "Operational" },
];

export default function StatusPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="System status"
        title="All systems operational."
        lead="A live view of the components behind every NordStern anchor. This page reflects our current operating state; subscribe via the community channels for incident updates."
        secondary={{ label: "Stellar network status", href: `${STELLAR.developers}` }}
      />

      <Block>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-3 rounded-card border border-line bg-white p-5">
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[color:var(--color-up)] opacity-50" />
              <span className="relative inline-flex size-3 rounded-full bg-[color:var(--color-up)]" />
            </span>
            <span className="text-[15px] font-medium text-ink">
              All components operational
            </span>
          </div>
          <ul className="divide-y divide-line rounded-card border border-line bg-white">
            {COMPONENTS.map((c) => (
              <li key={c.name} className="flex items-center justify-between gap-4 p-5">
                <span className="text-[15px] text-ink">{c.name}</span>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-up)]">
                  <span className="size-2 rounded-full bg-[color:var(--color-up)]" />
                  {c.state}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Running on Stellar testnet by default. Incident history and a subscribable
            status feed are on the roadmap — for now, follow{" "}
            <a href={EXTERNAL.twitter} target="_blank" rel="noreferrer" className="font-medium text-brand-700 hover:underline">
              @NordsternIN
            </a>{" "}
            for real-time updates.
          </p>
        </div>
      </Block>

      <CtaBand title="Questions about reliability?" secondary={{ label: "Contact us", href: ROUTES.contact }} />
    </MarketingShell>
  );
}
