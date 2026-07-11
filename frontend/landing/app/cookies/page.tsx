import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Prose } from "@/components/marketing/blocks";
import { ROUTES, EXTERNAL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How NordStern uses cookies and similar technologies on its website, and how you can control them.",
  alternates: { canonical: ROUTES.cookies },
};

export default function CookiesPage() {
  return (
    <MarketingShell>
      <PageHero eyebrow="Legal" title="Cookie Policy" lead="Last updated: 11 July 2026" />
      <Prose>
        <p>
          This Cookie Policy explains how NordStern uses cookies and similar
          technologies on our website. It should be read alongside our{" "}
          <a href={ROUTES.privacy}>Privacy Policy</a>.
        </p>

        <h2>What cookies are</h2>
        <p>
          Cookies are small text files placed on your device when you visit a website.
          They help the site function and let us understand how it&apos;s used.
        </p>

        <h2>How we use them</h2>
        <ul>
          <li><strong>Essential.</strong> Required for the site to load and function correctly.</li>
          <li><strong>Analytics.</strong> Aggregate, privacy-respecting measurement of how the site is used, so we can improve it.</li>
        </ul>
        <p>
          We do not use cookies for advertising or cross-site tracking.
        </p>

        <h2>Managing cookies</h2>
        <p>
          Most browsers let you refuse or delete cookies through their settings.
          Blocking essential cookies may affect how the site works.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about our use of cookies? Email{" "}
          <a href={`mailto:${EXTERNAL.email}`}>{EXTERNAL.email}</a>.
        </p>

        <p>
          <em>This page is a general description and not legal advice.</em>
        </p>
      </Prose>
    </MarketingShell>
  );
}
