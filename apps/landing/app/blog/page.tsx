import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, ComingSoon, LinkList } from "@/components/marketing/blocks";
import { Block } from "@/components/marketing/blocks";
import { ROUTES, docs } from "@/lib/links";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "The NordStern blog — product news, deep dives on running a compliant Stellar anchor, and lessons from building INR on/off-ramps. Launching soon.",
  alternates: { canonical: ROUTES.blog },
};

export default function BlogPage() {
  return (
    <MarketingShell>
      <PageHero
        badge="Coming soon"
        title="The NordStern blog."
        lead="Product news, engineering deep dives, and hard-won lessons on running a compliant anchor. We're writing the first pieces now."
        primary={{ label: "Talk to us", href: ROUTES.contact }}
        secondary={{ label: "Read the docs", href: docs() }}
      />

      <ComingSoon
        what="A place for practical writing about anchor infrastructure — how SEP flows work in production, what compliance actually requires in India, and how we think about treasury, KYC, and rails."
        why="The best way to evaluate infrastructure is to understand how it's built. We'd rather show our reasoning than list features."
        coming={[
          "What to look for in a SEP-24 provider",
          "Adoption tooling for embedded finance programs",
          "Running a compliant anchor: beyond the API",
          "Treasury and settlement for INR ↔ USDC",
        ]}
        audience="Founders, engineers, and compliance leads evaluating whether to build or buy their anchor stack."
        cta={{ label: "Get notified — talk to us", href: ROUTES.contact }}
      />

      <Block tone="surface" eyebrow="In the meantime" title="Start with the docs">
        <LinkList
          items={[
            { label: "Core concepts", href: docs("getting-started/concepts"), desc: "How anchors, SEPs, and ramps fit together." },
            { label: "Compliance", href: docs("getting-started/compliance"), desc: "The regulatory picture for Indian anchors." },
            { label: "Architecture overview", href: docs("engineering/architecture-overview"), desc: "How the platform is put together." },
          ]}
        />
      </Block>
    </MarketingShell>
  );
}
