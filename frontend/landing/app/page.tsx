import Image from "next/image";
import Link from "next/link";
import { BgStage } from "@/components/bg-stage";
import { Hero } from "@/components/hero";
import { BigStatement, BloomSection, UseCases, Features, HowItWorks, FinalCTA } from "@/components/landing-sections";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <div className="relative min-h-screen text-gray-900 font-sans flex flex-col items-center">
      <BgStage />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-black/[0.04] bg-white/60 px-8 py-4 backdrop-blur-md sm:px-16">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Nordstern logo" width={28} height={28} className="object-contain" />
          <span className="text-xl font-semibold tracking-tight">Nordstern</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-800">
          <Link href="#" className="hover:text-black transition-colors">USD bloom</Link>
          <Link href="#" className="hover:text-black transition-colors">Business</Link>
          <Link href="#platform" className="hover:text-black transition-colors">Treasury</Link>
          <Link href="#how" className="hover:text-black transition-colors">Developers</Link>
          <Link href="#" className="hover:text-black transition-colors">Join us</Link>
        </div>

        <div>
          <button className="bg-[#2a283e] hover:bg-[#1a1926] text-white px-7 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer">
            Launch BETA
          </button>
        </div>
      </nav>

      <Hero />
      <BigStatement line1="On & off-ramps" pre="for" post="every anchor" />
      <BloomSection />
      <BigStatement
        line1="Earn yield while you"
        pre="stay"
        post="pegged"
        ctaLabel="Explore USD Bloom"
        ctaHref="#"
      />
      <UseCases />
      <Features />
      <HowItWorks />
      <FinalCTA />

      <div className="w-full">
        <SiteFooter />
      </div>
    </div>
  );
}
