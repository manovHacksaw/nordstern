import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Block, LinkList } from "@/components/marketing/blocks";
import { ROUTES, docs } from "@/lib/links";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <MarketingShell>
      <PageHero
        badge="404"
        title="This page drifted off course."
        lead="The page you're looking for doesn't exist or has moved. Here are some good places to pick the trail back up."
        primary={{ label: "Back to home", href: ROUTES.home }}
        secondary={{ label: "Talk to us", href: ROUTES.contact }}
      />
      <Block eyebrow="Popular destinations" title="Where to next">
        <LinkList
          items={[
            { label: "The platform", href: "/#platform", desc: "What NordStern runs for your anchor." },
            { label: "Pricing", href: ROUTES.pricing, desc: "Managed or full-control, one platform underneath." },
            { label: "Documentation", href: docs(), desc: "Guides, API reference, and architecture." },
            { label: "FAQ", href: ROUTES.faq, desc: "The questions anchor teams ask most." },
          ]}
        />
      </Block>
    </MarketingShell>
  );
}
