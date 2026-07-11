import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Block, CheckList, CtaBand } from "@/components/marketing/blocks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES, EXTERNAL, docs } from "@/lib/links";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "NordStern pricing: managed Ready-to-Launch anchors or full API control. Bring your license, bank, and liquidity — we run the stack. Talk to us for a quote tailored to your volume.",
  alternates: { canonical: ROUTES.pricing },
};

const PLANS = [
  {
    name: "Ready-to-Launch",
    tag: "Most popular",
    body: "A fully managed, white-labelled anchor embedded with a single line of code. We run everything; you collect the spread.",
    features: [
      "Managed SEP-1/10/12/24 servers",
      "INR rails (UPI, IMPS, NEFT, RTGS) via partners",
      "Didit KYC + compliance monitoring",
      "Operator console & treasury views",
      "White-labelled interactive flow",
    ],
    cta: { label: "Talk to us", href: EXTERNAL.register },
    featured: true,
  },
  {
    name: "Custom / API",
    tag: "Full control",
    body: "Design your own money experience with direct control over SEP servers, treasury, and pricing on the same infrastructure.",
    features: [
      "Everything in Ready-to-Launch",
      "Unified SDK + REST APIs",
      "Real-time webhooks",
      "Custom pricing & spread controls",
      "Sandbox and testnet environments",
    ],
    cta: { label: "Explore the API", href: docs("developers") },
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Pricing"
        title="Priced around the value you capture."
        lead="NordStern is B2B infrastructure — you bring your license, bank relationship, and liquidity; we run the stack and you collect the spread and fees. Pricing scales with volume, so let's tailor it to your launch."
        primary={{ label: "Get a quote", href: EXTERNAL.register }}
        secondary={{ label: "See what's included", href: "/#platform" }}
      />

      <Block eyebrow="Plans" title="Two ways to launch, one platform underneath">
        <div className="grid gap-6 lg:grid-cols-2">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-card border p-8 ${p.featured ? "border-brand-300 bg-white shadow-[0_24px_60px_-32px_rgba(20,20,43,.25)]" : "border-line bg-white"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-ink">{p.name}</h3>
                <Badge variant={p.featured ? "mint" : "muted"}>{p.tag}</Badge>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.body}</p>
              <div className="my-6 h-px bg-line" />
              <div className="flex-1">
                <CheckList items={p.features} />
              </div>
              <Button
                href={p.cta.href}
                variant={p.featured ? "primary" : "ghost"}
                className="mt-8 w-full"
                {...(p.cta.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {p.cta.label}
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">
          Not sure which fits?{" "}
          <Link href={ROUTES.contact} className="font-medium text-brand-700 hover:underline">
            Talk to us
          </Link>{" "}
          and we&apos;ll help you scope it. See{" "}
          <Link href={ROUTES.faq} className="font-medium text-brand-700 hover:underline">
            frequently asked questions
          </Link>
          .
        </p>
      </Block>

      <Block tone="surface" eyebrow="Note" title="What pricing does not include">
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          NordStern is a technology company and not a bank. Banking, custody, and
          settlement are provided by regulated partners, and the associated
          regulatory standing (license, FIU-IND registration where applicable)
          remains with the anchor. We scope those dependencies with you before go-live.
        </p>
      </Block>

      <CtaBand title="Let's price your launch." />
    </MarketingShell>
  );
}
