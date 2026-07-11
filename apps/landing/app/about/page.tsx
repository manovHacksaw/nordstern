import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Block, FeatureGrid, CtaBand } from "@/components/marketing/blocks";
import { ROUTES } from "@/lib/links";

export const metadata: Metadata = {
  title: "About",
  description:
    "NordStern builds the compliant anchor infrastructure that connects local banking rails to the global Stellar network — run as managed infrastructure so licensed businesses can launch fiat on/off-ramps.",
  alternates: { canonical: ROUTES.about },
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Company"
        title="Infrastructure for the internet of money."
        lead="Every anchor needs the same stack — SEP servers, KYC, payment rails, treasury, and compliance workflows, wired together and kept running. NordStern operates it as managed infrastructure, so a licensed business can launch a fiat on/off-ramp on its local rails without building it from scratch."
        primary={{ label: "Talk to us", href: ROUTES.contact }}
        secondary={{ label: "See the platform", href: "/#platform" }}
      />

      <Block
        eyebrow="Our thesis"
        title="Being an anchor should be a business decision, not a two-year engineering project."
        lead="A Stellar anchor is the on/off-ramp between fiat and the network. Doing it well means running protocol servers, KYC/AML, banking integrations, treasury, and compliance — expensive and repetitive to rebuild for every anchor. We run that once, well, on your behalf."
      >
        <FeatureGrid
          items={[
            {
              icon: "bank",
              title: "Bring your standing",
              body: "You bring the license, the bank relationship, and the liquidity. We bring the technical and operational stack.",
            },
            {
              icon: "shield",
              title: "Compliance-first",
              body: "FIU-IND reporting, sanctions screening, and an auditable trail are designed in — not bolted on later.",
            },
            {
              icon: "layers",
              title: "Built to generalise",
              body: "One anchor done well, architected so the same infrastructure scales to many anchors on shared rails.",
            },
          ]}
        />
      </Block>

      <Block tone="surface" eyebrow="What we value" title="How we build">
        <FeatureGrid
          items={[
            { icon: "rocket", title: "Ship the real flow", body: "We finish end-to-end money flows before scaffolding features nobody uses yet." },
            { icon: "users", title: "Users keep custody", body: "Funds stay in the user's own Stellar wallet. We render the experience, never take the keys." },
            { icon: "code", title: "Everything is a seam", body: "KYC, payments, and banking are swappable adapters, because the regulatory landscape keeps moving." },
          ]}
        />
      </Block>

      <CtaBand
        title="Want to launch an anchor with us?"
        body="We onboard anchors by hand today — tell us about your license, bank, and target flows."
        secondary={{ label: "Read the docs", href: "/#build" }}
      />
    </MarketingShell>
  );
}
