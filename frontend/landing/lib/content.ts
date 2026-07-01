/**
 * All landing copy + data in one typed place. Sections stay presentational;
 * branding/wording iterations happen here.
 */

export const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Anchors", href: "#audiences" },
  { label: "Developers", href: "#build" },
  { label: "Resources", href: "#resources" },
] as const;

export const HERO = {
  eyebrow: { label: "Read more: SEP-24 & compliance", href: "#" },
  title: "Launch your anchor with embedded finance.",
  lead: "Instant fiat rails, automated KYC, and built-in compliance. Go live on Stellar with a fully managed on/off-ramp — or build with full control.",
  primary: { label: "Talk to us", href: "#cta" },
  secondary: { label: "See a demo", href: "#" },
} as const;

export const BACKERS = [
  "Stellar",
  "Helix Capital",
  "Northwind",
  "NGC",
  "NovaSeed",
] as const;

export const OUTCOMES = {
  eyebrow: "Built for modern money movement",
  title: "Proven to grow ramp volume and trust",
  lead: "Anchors on NordStern launch faster, settle quicker, and stay compliant.",
  cta: { label: "Read case studies", href: "#" },
  stats: [
    {
      brand: "Relay",
      title: "Faster to a live on/off-ramp",
      value: "6×",
      caption: "quicker launch",
    },
    {
      brand: "Baselane",
      title: "Settled across Indian bank rails",
      value: "₹1B+",
      caption: "monthly volume",
    },
    {
      brand: "Roofstock",
      title: "Lower compliance overhead",
      value: "50%",
      caption: "less ops load",
    },
  ],
} as const;

export const PRIMITIVES = {
  eyebrow: "The platform",
  title: "One platform, every anchor primitive",
  lead: "Compose simple building blocks into any money flow your users need.",
  items: [
    {
      title: "Virtual accounts",
      body: "Every user gets a dedicated Indian account number & IFSC. Money routes in over UPI, IMPS, NEFT and RTGS — and mints on Stellar automatically.",
      href: "#",
      icon: "bank",
    },
    {
      title: "Money movement",
      body: "On/off-ramp with same-day settlement. Send, receive, and reconcile across fiat and Stellar with a single API.",
      href: "#",
      icon: "bolt",
      featured: true,
    },
    {
      title: "KYC & onboarding",
      body: "Passive liveness, deepfake detection and face-match tuned for Tier 2/3 India. We verify your users on your behalf.",
      href: "#",
      icon: "users",
    },
    {
      title: "Compliance & reporting",
      body: "FIU-IND reporting, sanctions screening, monitoring rules and a hash-chained audit log — built in.",
      href: "#",
      icon: "shield",
    },
  ],
} as const;

export const BUILD_PATHS = {
  eyebrow: "Flexible by design",
  title: "Managed solutions or full control",
  lead: "Both paths run on the same underlying infrastructure.",
  paths: [
    {
      title: "Custom",
      body: "Design your own money experience with direct control over SEP-24/SEP-10 servers, treasury and pricing.",
      chips: ["Full API", "Launch in 6 weeks"],
      href: "#",
      variant: "code" as const,
    },
    {
      title: "Ready-to-Launch",
      body: "A fully managed, white-labelled anchor embedded with a single line of code.",
      chips: ["No code", "Launch in 3 weeks"],
      href: "#",
      variant: "dashboard" as const,
    },
  ],
} as const;

export const AUDIENCES = {
  eyebrow: "Who it's for",
  title: "Purpose-built for fintechs, wallets, and exchanges",
  items: [
    {
      title: "Fintechs & PSPs",
      body: "Embed ramps, banking and payouts to become the money hub for your customers.",
      icon: "bank",
    },
    {
      title: "Wallets",
      body: "Offer instant on/off-ramps and balances to grow engagement and revenue.",
      icon: "bolt",
    },
    {
      title: "Exchanges",
      body: "Give users a compliant fiat gateway with cards and money movement built in.",
      icon: "users",
    },
  ],
} as const;

export const TRUST = {
  title: "Infrastructure you can trust",
  lead: "Teams choose NordStern to operate complex money programs with confidence — from first ramp to millions of users.",
  stats: [
    { value: "2M+", label: "verified users" },
    { value: "₹100B+", label: "annual ramp volume" },
    { value: "99.98%", label: "settlement uptime" },
  ],
} as const;

export const RESOURCES = {
  eyebrow: "Resources",
  title: "Guides for anchor operators",
  posts: [
    { tag: "Blog", read: "3 min", title: "What to look for in a SEP-24 provider" },
    { tag: "Blog", read: "5 min", title: "Adoption tooling for embedded finance programs" },
  ],
  featured: [
    { title: "Enterprise-grade financial infrastructure", href: "#" },
    { title: "Beyond the API: running a compliant anchor", href: "#" },
  ],
  cta: { label: "See all resources", href: "#" },
} as const;

export const FINAL_CTA = {
  title: "Launch money solutions for your users. Unlock new revenue for your anchor.",
  cta: { label: "Talk to us", href: "#" },
} as const;

export const FOOTER = {
  cta: {
    title: "Launch your Anchor today",
    body: "Build compliant Stellar anchors with integrated fiat rails, KYC, and on/off ramps.",
    button: { label: "Talk to us", href: "#cta" },
  },
  status: "Live on Stellar",
  columns: {
    Platform: ["Anchors", "On/Off Ramp", "Treasury", "Compliance"],
    Developers: ["Documentation", "API Reference", "SDK", "Status"],
    Resources: ["Blog", "Guides", "Changelog", "FAQ"],
    Company: ["About", "Contact", "Careers", "Privacy"],
    Social: ["X", "LinkedIn", "GitHub", "Discord"],
  },
  legal: [
    "NordStern is a technology company and not a bank. Banking services are provided by our regulated partners.",
  ],
} as const;
