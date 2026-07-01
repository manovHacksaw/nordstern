/**
 * Single source of truth for site-wide identity, SEO, and social metadata.
 * Everything under app/ (layout metadata, manifest, robots, sitemap, OG/icon
 * routes, JSON-LD) reads from here — change branding in one place.
 *
 * NOTE: `url` is a placeholder production origin until the real domain is live.
 */
export const siteConfig = {
  name: "NordStern",
  shortName: "NordStern",
  // Placeholder production URL — swap when the domain is finalized.
  url: "https://nordstern.finance",
  title: "NordStern — Launch Compliant Stellar Anchors",
  titleTemplate: "%s · NordStern",
  description:
    "Build production-ready Stellar Anchors with integrated fiat rails, automated KYC, compliance, treasury, and seamless on/off ramps.",
  tagline: "Launch Compliant Stellar Anchors",
  ogDescription:
    "Integrated fiat rails, automated KYC, compliance, treasury, and seamless on/off ramps.",
  locale: "en_US",
  category: "finance",
  keywords: [
    "Stellar anchor",
    "embedded finance",
    "fiat on-ramp",
    "fiat off-ramp",
    "SEP-24",
    "SEP-10",
    "KYC",
    "compliance",
    "treasury",
    "stablecoin",
    "UPI",
    "IMPS",
    "NEFT",
    "RTGS",
    "crypto payments India",
  ],
  authors: [{ name: "NordStern" }],
  creator: "NordStern",
  publisher: "NordStern",
  // Brand tokens mirrored from globals.css @theme (kept in sync for OG/icons,
  // which render outside the Tailwind runtime).
  colors: {
    brand: "#AB9FF2",
    brandRing: "#2A2342",
    canvas: "#FFFFFF",
    ink: "#0B0B0B",
    muted: "#5B5B5B",
    surface: "#F2F4F3",
    noir: "#0A0A0A",
    up: "#2EC08B",
  },
  twitter: {
    handle: "@NordsternIN",
    url: "https://x.com/NordsternIN",
  },
  links: {
    twitter: "https://x.com/NordsternIN",
    linkedin: "https://www.linkedin.com/company/nordstern",
    github: "https://github.com/nordstern",
    discord: "https://discord.gg/nordstern",
  },
} as const;

/** Social profiles for JSON-LD `sameAs` / footer, filtered to real ones. */
export const socialProfiles = Object.values(siteConfig.links);
