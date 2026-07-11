import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Prose } from "@/components/marketing/blocks";
import { ROUTES, EXTERNAL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How NordStern collects, uses, and protects information across its website and anchor infrastructure, and the choices available to you.",
  alternates: { canonical: ROUTES.privacy },
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <PageHero eyebrow="Legal" title="Privacy Policy" lead="Last updated: 11 July 2026" />
      <Prose>
        <p>
          This Privacy Policy explains how NordStern (&ldquo;NordStern&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;)
          handles information in connection with our website and the anchor
          infrastructure we operate on behalf of businesses. NordStern is a
          technology company and not a bank; banking services are provided by our
          regulated partners.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li><strong>Website usage.</strong> Basic analytics such as pages viewed and aggregate device information, used to improve the site.</li>
          <li><strong>Contact information.</strong> Details you provide when you email us or begin onboarding, such as your name, company, and business context.</li>
          <li><strong>Anchor operations.</strong> When we operate infrastructure for an anchor, transaction metadata is processed to move funds and meet compliance obligations. Identity verification (KYC) is performed by our verification provider under a separate consent.</li>
        </ul>

        <h2>How we use information</h2>
        <ul>
          <li>To provide, operate, and improve our website and services.</li>
          <li>To respond to enquiries and support onboarding.</li>
          <li>To meet legal, regulatory, and compliance obligations, including reporting where required.</li>
        </ul>

        <h2>Custody and your funds</h2>
        <p>
          For anchor flows, assets remain in the user&apos;s own Stellar wallet. NordStern
          renders the deposit and withdrawal experience but does not take custody of
          user keys. See our <a href={ROUTES.security}>security overview</a> for more.
        </p>

        <h2>Sharing</h2>
        <p>
          We share information with service providers (for example, KYC, payment, and
          hosting partners) only as needed to deliver the service, and with authorities
          where the law requires it. We do not sell personal information.
        </p>

        <h2>Data retention and residency</h2>
        <p>
          We retain information for as long as needed to provide the service and meet
          legal obligations, then delete or anonymise it. Data residency and controller
          responsibilities for KYC data are determined per engagement with our partners.
        </p>

        <h2>Your choices</h2>
        <p>
          You may request access to or deletion of information we hold about you, subject
          to legal limits, by contacting us at{" "}
          <a href={`mailto:${EXTERNAL.email}`}>{EXTERNAL.email}</a>.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Email{" "}
          <a href={`mailto:${EXTERNAL.email}`}>{EXTERNAL.email}</a> or visit our{" "}
          <a href={ROUTES.contact}>contact page</a>.
        </p>

        <p>
          <em>
            This page is a general description and not legal advice. Our final,
            counsel-reviewed policy governs where the two differ.
          </em>
        </p>
      </Prose>
    </MarketingShell>
  );
}
