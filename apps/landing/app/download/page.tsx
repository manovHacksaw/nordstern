import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, ComingSoon } from "@/components/marketing/blocks";
import { ROUTES } from "@/lib/links";

export const metadata: Metadata = {
  title: "Get the app",
  description:
    "The NordStern consumer app connects people to a network of licensed anchors to move money on and off Stellar — verify once, deposit rupees for USDC, or send it back to your bank. Launching soon on iOS and Android.",
  alternates: { canonical: ROUTES.download },
};

export default function DownloadPage() {
  return (
    <MarketingShell>
      <PageHero
        badge="Launching soon"
        title="One app. A network of anchors."
        lead="A consumer app that connects people to licensed anchors to move money on and off Stellar. Pick an anchor, verify once, then deposit rupees to receive USDC — or send it straight back to your bank. Funds never leave the wallet you already trust."
        primary={{ label: "Talk to us", href: ROUTES.contact }}
        secondary={{ label: "How it works", href: "/#mobile-app" }}
      />

      <ComingSoon
        what="A mobile app (iOS and Android) that gives people one place to discover anchors, complete KYC once, and ramp between INR and USDC directly inside the Stellar wallets they trust."
        why="Anchors get demand from day one; users get a single, verified identity that works across every launched anchor instead of re-verifying for each."
        coming={[
          "iOS and Android apps on the App Store and Google Play",
          "Discover and switch between licensed anchors",
          "Verify once with Didit, reuse across anchors",
          "Self-custodial INR ↔ USDC on/off-ramp",
        ]}
        audience="People in India who want a simple, compliant way to move between rupees and USDC without giving up custody."
        cta={{ label: "Get notified", href: ROUTES.contact }}
      />
    </MarketingShell>
  );
}
