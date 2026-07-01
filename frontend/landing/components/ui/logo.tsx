import { cn } from "@/lib/cn";

/** NordStern comet / north-star mark. `tone` flips for light vs dark grounds. */
export function LogoMark({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const ring = tone === "dark" ? "#2a2342" : "#ffffff";
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("size-7", className)} aria-hidden>
      <circle cx="24" cy="24" r="17" stroke={ring} strokeWidth="3" />
      <path
        d="M41 7C31 15 25.5 19 19.5 27c-3.4 4.6-2.6 8.4 2.4 6.6C28 31.3 33.8 23.5 41 7Z"
        fill="var(--color-brand)"
      />
    </svg>
  );
}

/** Full lockup: mark + wordmark. */
export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark tone={tone} />
      <span
        className={cn(
          "text-lg font-semibold tracking-tight",
          tone === "dark" ? "text-ink" : "text-white",
        )}
      >
        NordStern
      </span>
    </span>
  );
}
