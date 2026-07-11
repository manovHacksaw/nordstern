import { cn } from "@/lib/cn";
import { ArrowUpRight } from "./icons";

/**
 * Inline email capture pill. Server component (no client handler needed for the
 * prototype). `tone` adapts for light vs dark grounds. Dedupes the form that
 * previously lived in both hero and CTA.
 */
export function EmailCapture({
  className,
  tone = "light",
  cta = "Get early access",
}: {
  className?: string;
  tone?: "light" | "dark";
  cta?: string;
}) {
  const dark = tone === "dark";
  return (
    <form
      className={cn(
        "flex w-full items-center gap-2 rounded-pill border p-1.5 pl-5 backdrop-blur-sm transition-colors focus-within:border-brand",
        dark ? "border-white/15 bg-white/[0.06]" : "border-line bg-white",
        className,
      )}
    >
      <input
        type="email"
        required
        placeholder="Enter your email"
        aria-label="Email address"
        className={cn(
          "min-w-0 flex-1 bg-transparent text-sm focus:outline-none",
          dark
            ? "text-white placeholder:text-white/40"
            : "text-ink placeholder:text-subtle",
        )}
      />
      <button
        type="submit"
        className="group inline-flex shrink-0 items-center gap-2 rounded-pill bg-brand py-2 pl-4 pr-2 text-ink transition-colors hover:bg-brand-300"
      >
        <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide">
          {cta}
        </span>
        <span className="grid size-7 place-items-center rounded-full bg-ink text-sm text-white transition-transform duration-200 group-hover:rotate-45">
          <ArrowUpRight />
        </span>
      </button>
    </form>
  );
}
