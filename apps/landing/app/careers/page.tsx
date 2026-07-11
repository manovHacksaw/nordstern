import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, ComingSoon } from "@/components/marketing/blocks";
import { ROUTES, MAILTO } from "@/lib/links";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Help build the compliant anchor infrastructure for India's move onto Stellar. NordStern is a small team hiring across engineering, compliance, and operations.",
  alternates: { canonical: ROUTES.careers },
};

export default function CareersPage() {
  return (
    <MarketingShell>
      <PageHero
        badge="We're hiring soon"
        title="Build the future of money movement."
        lead="NordStern is a small team building the infrastructure that lets businesses become compliant Stellar anchors in India. We're formalising roles across engineering, compliance, and operations."
        primary={{ label: "Introduce yourself", href: MAILTO.hello }}
        secondary={{ label: "See what we're building", href: ROUTES.about }}
      />

      <ComingSoon
        what="Open roles across backend engineering (TypeScript, Stellar), payments and treasury, compliance and risk, and product/operations — plus room for exceptional generalists."
        why="Anchoring fiat to Stellar well means combining deep protocol work with real regulatory and operational rigour. That's a rare, interesting problem, and it needs a range of people."
        coming={[
          "Backend / infrastructure engineers (TypeScript, Node, Stellar SDK)",
          "Payments & treasury operations",
          "Compliance & risk (India fintech / VDA)",
          "Product and design for operator tooling",
        ]}
        audience="People who want ownership at an early stage and care about building financial infrastructure responsibly."
        cta={{ label: "Email us your background", href: MAILTO.hello }}
      />
    </MarketingShell>
  );
}
