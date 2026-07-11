import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Block, LinkList, CtaBand } from "@/components/marketing/blocks";
import { ROUTES, EXTERNAL, MAILTO } from "@/lib/links";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the NordStern team about launching a compliant Stellar anchor in India — sales, support, partnerships, and community.",
  alternates: { canonical: ROUTES.contact },
};

export default function ContactPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your anchor."
        lead="Whether you're scoping a launch, evaluating rails, or just have questions about becoming a Stellar anchor in India — we'd like to hear from you."
        primary={{ label: "Start onboarding", href: EXTERNAL.register }}
        secondary={{ label: "Email sales", href: MAILTO.sales }}
      />

      <Block eyebrow="Reach us" title="Pick the right channel">
        <LinkList
          items={[
            { label: "Sales & partnerships", href: MAILTO.sales, desc: "Scope a launch, discuss rails, request a walkthrough." },
            { label: "Product support", href: MAILTO.support, desc: "Questions about an existing integration or console." },
            { label: "General enquiries", href: MAILTO.hello, desc: "Anything else — we route it to the right person." },
            { label: "Start founder onboarding", href: EXTERNAL.register, desc: "Register your business and begin the anchor journey." },
          ]}
        />
      </Block>

      <Block tone="surface" eyebrow="Community" title="Follow along">
        <LinkList
          items={[
            { label: "GitHub", href: EXTERNAL.github, desc: "Open-source components and the self-hostable anchor kit." },
            { label: "X / Twitter", href: EXTERNAL.twitter, desc: "Product updates and Stellar ecosystem news." },
            { label: "LinkedIn", href: EXTERNAL.linkedin, desc: "Company updates and hiring." },
            { label: "Discord", href: EXTERNAL.discord, desc: "Chat with the team and other anchor operators." },
          ]}
        />
      </Block>

      <CtaBand title="Ready when you are." />
    </MarketingShell>
  );
}
