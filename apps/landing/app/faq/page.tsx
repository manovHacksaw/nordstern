import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Block, CtaBand } from "@/components/marketing/blocks";
import { FAQ } from "@/lib/content";
import { ROUTES } from "@/lib/links";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about becoming a Stellar anchor with NordStern — what we run, how long it takes, supported rails, KYC, and custody.",
  alternates: { canonical: ROUTES.faq },
};

/** FAQPage structured data for rich results. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.items.map((it) => ({
    "@type": "Question",
    name: it.q,
    acceptedAnswer: { "@type": "Answer", text: it.a },
  })),
};

export default function FaqPage() {
  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHero
        eyebrow="FAQ"
        title="Everything you need to know, before you launch."
        lead="Answers to the questions anchor teams ask us most. Can't find yours? Talk to us."
        primary={{ label: "Talk to us", href: ROUTES.contact }}
      />

      <Block>
        <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
          {FAQ.items.map((it) => (
            <details key={it.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-ink">
                {it.q}
                <span className="text-subtle transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{it.a}</p>
            </details>
          ))}
        </div>
      </Block>

      <CtaBand title="Still have questions?" secondary={{ label: "Contact us", href: ROUTES.contact }} />
    </MarketingShell>
  );
}
