/**
 * Single source of truth for every destination the landing links to.
 *
 * Three buckets:
 *  - INTERNAL routes we own (real App-Router pages under app/).
 *  - EXTERNAL apps/services (founder onboarding, docs site, socials) — origins are
 *    env-overridable so testnet/staging/prod stay config, not code (AGENTS §6/§7).
 *  - STELLAR — official Stellar/SEP references we deliberately point at instead of
 *    duplicating protocol docs ourselves.
 *
 * Never hardcode a raw href in a component or in lib/content.ts — reference these
 * so there is exactly one place to audit for dead links.
 */

import { siteConfig } from "@/lib/site";

/** Founder onboarding / "Talk to us" console (founder-console, register.*). */
const REGISTER_URL =
  process.env.NEXT_PUBLIC_REGISTER_URL ?? "https://register.nordstern.live";

/** Documentation site (the fumadocs `docs-website` app). */
const DOCS_ORIGIN =
  process.env.NEXT_PUBLIC_DOCS_URL ?? "https://docs.nordstern.live";

/** Build a docs deep-link. `docs("engineering/architecture")` → …/docs/engineering/architecture */
export function docs(path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `${DOCS_ORIGIN}/docs/${clean}` : `${DOCS_ORIGIN}/docs`;
}

/** Internal marketing routes (each backed by a real page under app/). */
export const ROUTES = {
  home: "/",
  about: "/about",
  contact: "/contact",
  careers: "/careers",
  pricing: "/pricing",
  security: "/security",
  privacy: "/privacy",
  terms: "/terms",
  cookies: "/cookies",
  status: "/status",
  roadmap: "/roadmap",
  customers: "/customers",
  integrations: "/integrations",
  architecture: "/architecture",
  identity: "/identity",
  anchorPlatform: "/anchor-platform",
  faq: "/faq",
  blog: "/blog",
  changelog: "/changelog",
  guides: "/guides",
  download: "/download",
} as const;

/**
 * On-page section anchors. Root-relative (`/#build`) so they also work from a
 * sub-route: Next navigates home, then scrolls. IDs verified against the
 * rendered sections in app/page.tsx.
 */
export const SECTIONS = {
  top: "/#top",
  platform: "/#platform",
  audiences: "/#audiences",
  outcomes: "/#outcomes",
  mission: "/#mission",
  build: "/#build",
  mobileApp: "/#mobile-app",
  trust: "/#trust",
  resources: "/#resources",
  faq: "/#faq",
  cta: "/#cta",
} as const;

/** External apps/services. */
export const EXTERNAL = {
  register: REGISTER_URL,
  docs: docs(),
  ...siteConfig.links, // twitter, linkedin, github, discord
  email: "hello@nordstern.live",
  sales: "sales@nordstern.live",
  support: "support@nordstern.live",
} as const;

export const MAILTO = {
  hello: `mailto:${EXTERNAL.email}`,
  sales: `mailto:${EXTERNAL.sales}`,
  support: `mailto:${EXTERNAL.support}`,
} as const;

/**
 * Official Stellar / SEP references. We link out to these rather than restating
 * protocol specs. GitHub SEP files + developers.stellar.org roots are stable.
 */
export const STELLAR = {
  developers: "https://developers.stellar.org",
  anchorPlatform: "https://developers.stellar.org/platforms/anchor-platform",
  horizon: "https://developers.stellar.org/docs/data/apis/horizon",
  soroban: "https://developers.stellar.org/docs/build/smart-contracts/overview",
  sdkJs: "https://github.com/stellar/js-stellar-sdk",
  walletsKit: "https://stellarwalletskit.dev",
  sep: (n: 1 | 6 | 10 | 12 | 24 | 31 | 38) =>
    `https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-${String(
      n,
    ).padStart(4, "0")}.md`,
} as const;

/** True for hrefs that must open with a full navigation / new tab (not next/link). */
export function isExternal(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");
}
