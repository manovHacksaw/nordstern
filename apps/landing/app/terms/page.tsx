import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PageHero, Prose } from "@/components/marketing/blocks";
import { ROUTES, EXTERNAL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing use of the NordStern website and services, including the nature of our infrastructure, acceptable use, and limitations.",
  alternates: { canonical: ROUTES.terms },
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <PageHero eyebrow="Legal" title="Terms of Service" lead="Last updated: 11 July 2026" />
      <Prose>
        <p>
          These Terms govern your use of the NordStern website and, where applicable,
          the services we provide to businesses operating as Stellar anchors. By using
          the site, you agree to these Terms.
        </p>

        <h2>What NordStern provides</h2>
        <p>
          NordStern is B2B infrastructure that lets a licensed business operate a
          compliant Stellar anchor without building the technical, KYC, banking, and
          operations stack itself. NordStern is a technology company and not a bank;
          banking, custody, and settlement are provided by regulated partners, and the
          associated regulatory standing remains with the anchor.
        </p>

        <h2>Acceptable use</h2>
        <ul>
          <li>Do not use the site or services for unlawful activity, or to circumvent sanctions, KYC/AML, or other compliance requirements.</li>
          <li>Do not disrupt, probe, or attempt to gain unauthorised access to our systems.</li>
          <li>Do not misrepresent your identity or your regulatory standing.</li>
        </ul>

        <h2>No financial or legal advice</h2>
        <p>
          Nothing on this site is financial, investment, or legal advice. The regulatory
          treatment of fiat-to-token on/off-ramps in India is evolving; you are
          responsible for your own compliance and should consult qualified counsel.
        </p>

        <h2>Service availability</h2>
        <p>
          We work to keep our services available and reliable but do not guarantee
          uninterrupted operation. Testnet is the default environment; moving real funds
          is a deliberate, separately governed step.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the extent permitted by law, NordStern is not liable for indirect,
          incidental, or consequential damages arising from use of the site. Services
          provided to anchors are governed by a separate written agreement, which
          controls over these Terms for those services.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these Terms from time to time. Continued use of the site after
          changes take effect constitutes acceptance.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Email <a href={`mailto:${EXTERNAL.email}`}>{EXTERNAL.email}</a> or
          visit our <a href={ROUTES.contact}>contact page</a>.
        </p>

        <p>
          <em>
            This page is a general description and not a binding contract or legal
            advice. Our final, counsel-reviewed terms govern where the two differ.
          </em>
        </p>
      </Prose>
    </MarketingShell>
  );
}
