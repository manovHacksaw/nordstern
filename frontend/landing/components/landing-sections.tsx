"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section, Stagger, StaggerItem, EASE } from "@/components/motion-primitives";

/* ---------------------------------- icons --------------------------------- */
function Icon({ path }: { path: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

/** Brand comet mark sized to sit inline inside a headline. */
function InlineMark() {
  return (
    <span className="mx-2 inline-grid h-[0.92em] w-[0.92em] translate-y-[0.12em] place-items-center rounded-[0.26em] bg-[#AB9FF2] align-baseline">
      <svg viewBox="0 0 48 48" fill="none" className="h-[66%] w-[66%]">
        <circle cx="24" cy="24" r="16" stroke="#fff" strokeWidth="3.4" />
        <path
          d="M40 8C31 15 26 19 20.5 26c-3 4-2.3 7.2 2 5.6C28.5 29 34 22 40 8Z"
          fill="#fff"
        />
      </svg>
    </span>
  );
}

/* ------------------------------ big statement ----------------------------- */
export function BigStatement({
  line1,
  pre,
  post,
  ctaLabel = "See more",
  ctaHref = "#platform",
}: {
  line1: string;
  pre: string;
  post: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <Section className="relative flex min-h-[80vh] items-center px-4 py-24 sm:px-8 lg:px-12">
      <Stagger className="mx-auto max-w-5xl text-center" amount={0.4}>
        <StaggerItem>
          <h2 className="text-[clamp(2.6rem,8.5vw,6.5rem)] font-semibold leading-[1.04] tracking-tight text-[#3c315b]">
            {line1}
            <br />
            {pre ? `${pre} ` : ""}
            <InlineMark /> {post}
          </h2>
        </StaggerItem>
        <StaggerItem>
          <div className="mt-12 flex justify-center">
            <a
              href={ctaHref}
              className="group inline-flex items-center gap-2 rounded-full bg-[#AB9FF2]/20 px-7 py-3.5 text-[15px] font-medium text-[#3c315b] transition-colors hover:bg-[#AB9FF2]/35"
            >
              {ctaLabel}
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
        </StaggerItem>
      </Stagger>
    </Section>
  );
}

/* -------------------------------- use cases ------------------------------- */
function BankIllustration() {
  return (
    <div className="relative mt-8 h-60 w-full overflow-hidden rounded-2xl">
      {/* lavender flower base */}
      <div className="absolute inset-x-0 bottom-0 h-28">
        <Image
          src="/hero_flowers_coins.png"
          alt=""
          fill
          sizes="600px"
          className="object-cover object-bottom opacity-90 [mask-image:linear-gradient(to_top,#000_30%,transparent)]"
        />
      </div>
      {/* neoclassical bank building */}
      <svg
        viewBox="0 0 200 150"
        className="absolute bottom-5 left-1/2 h-44 -translate-x-1/2 drop-shadow-[0_18px_30px_rgba(60,49,91,0.35)]"
        fill="none"
      >
        <defs>
          <linearGradient id="uc-bank" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#cfc6f9" />
            <stop offset="0.5" stopColor="#a99ff2" />
            <stop offset="1" stopColor="#6f5fd6" />
          </linearGradient>
        </defs>
        {/* pediment */}
        <path d="M100 6 196 54 4 54Z" fill="url(#uc-bank)" />
        {/* architrave */}
        <rect x="8" y="54" width="184" height="14" rx="2" fill="url(#uc-bank)" />
        {/* columns */}
        {[18, 50, 82, 114, 146, 178].map((x) => (
          <rect
            key={x}
            x={x - 7}
            y="70"
            width="13"
            height="62"
            rx="3"
            fill="url(#uc-bank)"
          />
        ))}
        {/* base */}
        <rect x="2" y="132" width="196" height="12" rx="2" fill="url(#uc-bank)" />
      </svg>
    </div>
  );
}

export function UseCases() {
  return (
    <Section className="relative px-4 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-start">
        {/* intro */}
        <Stagger amount={0.4}>
          <StaggerItem>
            <span className="text-[12.5px] uppercase tracking-[0.16em] text-gray-400">
              USD Bloom in action
            </span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="mt-3 text-[clamp(2.4rem,5vw,3.6rem)] font-semibold tracking-tight text-[#2a2342]">
              Use cases
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-gray-500">
              USD Bloom offers a variety of use cases for developers, businesses
              and treasuries seeking secure and profitable stablecoin
              integrations.
            </p>
          </StaggerItem>
        </Stagger>

        {/* business card */}
        <Stagger amount={0.25}>
          <StaggerItem x={40}>
            <div className="overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-white to-[#f3f0ff] p-8 shadow-[0_30px_70px_-40px_rgba(60,49,91,0.4)] ring-1 ring-black/[0.04]">
                <h3 className="text-2xl font-semibold text-[#2a2342]">
                  Business
                </h3>
                <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-gray-500">
                  Boost user engagement by offering USD Bloom, a secure
                  fiat-backed stablecoin with high yields, allowing your
                  customers to earn effortlessly on your platform.
                </p>
                <a
                  href="#"
                  className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#6f5fd6]"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#AB9FF2]/15 transition-colors group-hover:bg-[#AB9FF2]/30">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                  Learn more
                </a>
                <BankIllustration />
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </Section>
  );
}

/* ------------------------------ USD Bloom -------------------------------- */
const BACKERS = [
  "Helix Capital",
  "Northwind",
  "NGC",
  "NovaSeed",
  "Matter Labs",
  "DEXTools",
  "Polaris",
];

export function BloomSection() {
  return (
    <Section className="relative px-4 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        {/* heading + intro */}
        <Stagger className="grid gap-8 md:grid-cols-2 md:items-start" amount={0.3}>
          <StaggerItem>
            <h2 className="text-[clamp(2rem,4.4vw,3rem)] font-semibold tracking-tight text-[#2a2342]">
              What is USD Bloom?
            </h2>
            <a
              href="#"
              className="mt-5 inline-flex items-center rounded-full bg-[#2a283e] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a1926]"
            >
              Explore now
            </a>
          </StaggerItem>
          <StaggerItem>
            <p className="text-[17px] leading-relaxed text-gray-600 md:max-w-md md:justify-self-end md:pt-2">
              USD Bloom is a yield-bearing stablecoin that helps your capital
              grow while staying pegged to the U.S. dollar.
            </p>
          </StaggerItem>
        </Stagger>

        {/* cards */}
        <Stagger
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]"
          delayChildren={0.1}
          stagger={0.09}
          amount={0.2}
        >
          {/* card 1 — light, with visual */}
          <StaggerItem x={-40}>
            <div className="relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#eae5ff] to-[#d8cffb] p-7">
              <h3 className="relative z-10 text-xl font-semibold text-[#2a2342]">
                Capital that grows
              </h3>
              <div className="pointer-events-none absolute -right-6 top-6 h-48 w-48 overflow-hidden rounded-full opacity-90 mix-blend-multiply">
                <Image
                  src="/hero_flowers_coins.png"
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover object-center"
                />
              </div>
              <p className="relative z-10 max-w-[62%] text-[13.5px] leading-relaxed text-[#4a4368]">
                Earn passive income as your stablecoins are deployed into
                high-performing DeFi protocols.
              </p>
            </div>
          </StaggerItem>

          {/* card 2 — dark */}
          <StaggerItem x={0}>
            <div className="flex h-full min-h-[320px] flex-col justify-between rounded-3xl bg-[#241f37] p-7 text-white">
              <h3 className="text-xl font-semibold leading-snug">
                Always liquid,
                <br />
                always stable
              </h3>
              <p className="text-[13.5px] leading-relaxed text-white/55">
                Stay fully dollar-pegged with instant access to your funds — no
                lockups or delays.
              </p>
            </div>
          </StaggerItem>

          {/* card 3 — dark */}
          <StaggerItem x={40}>
            <div className="flex h-full min-h-[320px] flex-col justify-between rounded-3xl bg-[#241f37] p-7 text-white">
              <h3 className="text-xl font-semibold leading-snug">
                100%
                <br />
                hands-free
              </h3>
              <p className="text-[13.5px] leading-relaxed text-white/55">
                No need to manage strategies manually. USD Bloom works in the
                background for you.
              </p>
            </div>
          </StaggerItem>
        </Stagger>

        {/* backers */}
        <div className="mt-14 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[180px] text-[12.5px] leading-snug text-gray-400">
            Backed by the best companies and visionary angels.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {BACKERS.map((b) => (
              <span
                key={b}
                className="text-sm font-semibold tracking-tight text-gray-400/80 grayscale transition-colors hover:text-gray-500"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

const FEATURES = [
  {
    title: "Instant bank rails",
    body: "Every anchor gets a dedicated Indian account number & IFSC the moment they sign up. Money routes in over UPI, IMPS, NEFT and RTGS — and mints on Stellar automatically.",
    icon: "M3 10h18M7 15h2M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    x: -40,
  },
  {
    title: "KYC, done for you",
    body: "We verify your customers on your behalf — passive liveness, deepfake detection and face-match tuned for Tier 2/3 India. No onboarding headache, no fraud surface.",
    icon: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
    x: 0,
  },
  {
    title: "Compliance built in",
    body: "FIU-IND reporting, sanctions screening, monitoring rules and a hash-chained audit log. Stay launched instead of getting frozen.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
    x: 40,
  },
];

const STEPS = [
  {
    n: "01",
    title: "Bring your license & bank",
    body: "Sign up with your corporate PAN, GSTIN and FIU-IND registration. You stay the regulated entity.",
    x: -40,
  },
  {
    n: "02",
    title: "We provision the stack",
    body: "Virtual account rails, KYC, SEP-24/SEP-10 servers, treasury and compliance — live and white-labelled.",
    x: 0,
  },
  {
    n: "03",
    title: "Go live & earn the spread",
    body: "Wallets connect, users on/off-ramp through your hosted webview, and you monetise every flow.",
    x: 40,
  },
];

/* -------------------------------- features -------------------------------- */
export function Features() {
  return (
    <Section
      id="platform"
      className="relative px-4 sm:px-8 lg:px-12 py-28 lg:py-40"
    >
      <div className="mx-auto max-w-[1200px]">
        <Stagger className="mx-auto max-w-2xl text-center">
          <StaggerItem>
            <span className="text-sm font-medium uppercase tracking-[0.16em] text-[#7a6ad6]">
              The platform
            </span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.08] tracking-tight text-gray-900">
              Everything an anchor needs,
              <br className="hidden sm:block" /> nothing it has to build.
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-gray-500">
              You hold the banking and the license. We operate the rest of the
              stack so your on/off-ramp is live, compliant, and reserve-backed.
            </p>
          </StaggerItem>
        </Stagger>

        <Stagger
          className="mt-16 grid gap-6 md:grid-cols-3"
          delayChildren={0.12}
          stagger={0.08}
          amount={0.2}
        >
          {FEATURES.map((f) => (
            <StaggerItem key={f.title} x={f.x}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="h-full rounded-3xl border border-black/[0.06] bg-white/80 p-8 shadow-[0_20px_50px_-30px_rgba(60,49,91,0.3)] backdrop-blur-sm"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#AB9FF2]/15 text-[#6f5fd6]">
                  <Icon path={f.icon} />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {f.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-gray-500">
                  {f.body}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

/* ------------------------------- how it works ------------------------------ */
export function HowItWorks() {
  return (
    <Section id="how" className="relative px-4 sm:px-8 lg:px-12 py-28 lg:py-36">
      <div className="mx-auto max-w-[1200px]">
        <Stagger className="max-w-2xl">
          <StaggerItem>
            <span className="text-sm font-medium uppercase tracking-[0.16em] text-[#7a6ad6]">
              How it works
            </span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.08] tracking-tight text-gray-900">
              Live in three steps.
            </h2>
          </StaggerItem>
        </Stagger>

        <Stagger
          className="mt-16 grid gap-6 md:grid-cols-3"
          delayChildren={0.12}
          stagger={0.08}
          amount={0.2}
        >
          {STEPS.map((s) => (
            <StaggerItem key={s.n} x={s.x}>
              <div className="relative h-full overflow-hidden rounded-3xl border border-black/[0.06] bg-white/70 p-8 backdrop-blur-sm">
                <span className="font-mono text-sm font-semibold text-[#6f5fd6]">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-gray-500">
                  {s.body}
                </p>
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-8 text-[110px] font-bold leading-none text-[#AB9FF2]/[0.08]"
                >
                  {s.n}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

/* -------------------------------- final cta ------------------------------- */
export function FinalCTA() {
  return (
    <Section className="relative px-4 sm:px-8 lg:px-12 pb-24 pt-8">
      <div
        className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[2.5rem] px-8 py-20 text-center md:px-16"
        style={{
          background:
            "radial-gradient(120% 140% at 50% 0%, #3c315b 0%, #221d2e 55%, #161320 100%)",
        }}
      >
        <div className="pointer-events-none absolute left-1/2 top-[-30%] h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(171,159,242,0.35),transparent)] blur-3xl" />
        <div className="relative">
          <h2 className="text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.05] tracking-tight text-white">
            Your north star for
            <br className="hidden sm:block" /> fiat&nbsp;↔&nbsp;crypto.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[16.5px] text-[#c7bef7]">
            Tell us about your anchor. We&apos;ll get your rails, KYC and
            compliance live — and keep them that way.
          </p>

          <form className="mx-auto mt-9 flex w-full max-w-md items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] p-1.5 pl-5 backdrop-blur-sm transition-colors focus-within:border-[#AB9FF2]/60">
            <input
              type="email"
              required
              placeholder="Enter your email"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              type="submit"
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-[#AB9FF2] py-2 pl-4 pr-2 text-[#161616] transition-all duration-200 hover:bg-[#bcb1f6] active:scale-[0.98] cursor-pointer"
            >
              <span className="text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
                Get early access
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#161616] text-white transition-transform duration-200 group-hover:rotate-45">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </span>
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
}
