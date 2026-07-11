import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, ComingSoon, Block, LinkList } from "@/components/marketing/blocks";
import { ROUTES, docs, EXTERNAL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "What shipped on the NordStern platform — new rails, KYC providers, operator console features, and API changes. A public changelog is on the way.",
  alternates: { canonical: ROUTES.changelog },
};

export default function ChangelogPage() {
  return (
    <MarketingShell>
      <PageHero
        badge="Coming soon"
        title="What we shipped, every week."
        lead="We ship continuously across the anchor platform, rails, and operator tooling. A public, subscribable changelog is on the way — until then, follow along on GitHub."
        primary={{ label: "Follow on GitHub", href: EXTERNAL.github }}
        secondary={{ label: "Read the docs", href: docs() }}
      />

      <ComingSoon
        what="A running log of platform changes — new payment rails and KYC providers, operator console improvements, SDK releases, and API updates with migration notes."
        why="Teams building on infrastructure need to know what changed and when. A clear changelog is part of being dependable."
        coming={[
          "Versioned entries with dates and categories",
          "API and SDK change notes with upgrade guidance",
          "RSS / email subscription",
          "Deep links from release notes into the docs",
        ]}
        audience="Anyone integrating with or operating on the NordStern platform."
        cta={{ label: "Watch the repo", href: EXTERNAL.github }}
      />

      <Block tone="surface" eyebrow="For now" title="Track changes here">
        <LinkList
          items={[
            { label: "GitHub", href: EXTERNAL.github, desc: "Commits, releases, and the self-hostable kit." },
            { label: "Documentation", href: docs(), desc: "Always reflects current platform behaviour." },
          ]}
        />
      </Block>
    </MarketingShell>
  );
}
