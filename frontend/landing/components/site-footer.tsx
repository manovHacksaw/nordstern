"use client";

import { motion } from "framer-motion";
import { EASE } from "@/components/motion-primitives";

const COLS: Record<string, string[]> = {
  Product: ["Treasury", "Pricing", "Compliance", "Developers"],
  Resources: ["Docs", "SEP-24", "stellar.toml", "Status"],
  Company: ["About", "Careers", "Blog", "Contact"],
  Socials: ["X.com", "LinkedIn", "GitHub", "Telegram"],
};

/** NordStern comet mark, dark on the white card. */
function FooterMark() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
      <circle cx="24" cy="24" r="17.5" stroke="#2a2342" strokeWidth="3" />
      <path
        d="M41 7C31 15 25.5 19 19.5 27c-3.4 4.6-2.6 8.4 2.4 6.6C28 31.3 33.8 23.5 41 7Z"
        fill="#AB9FF2"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#a99ff2] p-3 sm:p-4">
      {/* white card */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="rounded-[2rem] bg-white p-8 sm:rounded-[2.5rem] sm:p-12 lg:p-16"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_2.4fr]">
          {/* left: mark + status */}
          <div className="flex flex-col justify-between gap-12">
            <FooterMark />
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f1f0f5] px-4 py-2 text-sm font-medium text-[#3c315b]">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Operational
            </span>
          </div>

          {/* right: newsletter + columns */}
          <div>
            <form className="rounded-3xl bg-[#f4f3f8] p-7 sm:p-10">
              <input
                type="email"
                required
                placeholder="Enter your email"
                aria-label="Email address"
                className="w-full bg-transparent font-medium tracking-tight text-[#3c315b] placeholder:text-[#9690ab] focus:outline-none text-[clamp(2rem,4.5vw,3.4rem)]"
              />
              <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-[15px] text-[#3c315b]">
                  Sign up for our newsletter and join the growing NordStern
                  community.
                </p>
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-[#AB9FF2]/35 px-7 py-3 text-[15px] font-medium text-[#3c315b] transition-colors hover:bg-[#AB9FF2]/60"
                >
                  Sign up
                </button>
              </div>
            </form>

            <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {Object.entries(COLS).map(([heading, items]) => (
                <div key={heading}>
                  <div className="text-[15px] font-medium text-gray-400">
                    {heading}
                  </div>
                  <ul className="mt-4 space-y-3.5">
                    {items.map((it) => (
                      <li key={it}>
                        <a
                          href="#"
                          className="text-[15px] text-[#2a2342] transition-colors hover:text-[#6f5fd6]"
                        >
                          {it}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* bottom bar on the purple frame */}
      <div className="flex flex-col items-center justify-between gap-3 px-3 pt-4 text-[13px] text-white/80 sm:flex-row">
        <span>© {new Date().getFullYear()} NordStern</span>
        <div className="flex gap-6">
          <a href="#" className="transition-colors hover:text-white">Terms</a>
          <a href="#" className="transition-colors hover:text-white">Privacy</a>
          <a href="#" className="transition-colors hover:text-white">
            Cookie Preferences
          </a>
        </div>
      </div>
    </footer>
  );
}
