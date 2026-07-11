import { cn } from "@/lib/cn";

type AuroraProps = {
  className?: string;
  /** Softens the whole field. */
  intensity?: "soft" | "medium" | "strong";
};

const OPACITY: Record<NonNullable<AuroraProps["intensity"]>, string> = {
  soft: "opacity-40",
  medium: "opacity-60",
  strong: "opacity-80",
};

/**
 * Ambient purple-forward aurora: blurred gradient blobs with slow CSS drift.
 * Server component (no JS shipped). Absolutely positioned — drop into any
 * `relative` container and it fills behind content via `-z-10`.
 */
export function Aurora({ className, intensity = "medium" }: AuroraProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        OPACITY[intensity],
        className,
      )}
    >
      <div
        className="absolute -left-[10%] top-[10%] h-[38rem] w-[38rem] rounded-full blur-3xl [animation:aurora-drift_18s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-aurora-lilac), transparent)",
        }}
      />
      <div
        className="absolute right-[-8%] top-[30%] h-[34rem] w-[34rem] rounded-full blur-3xl [animation:aurora-drift_22s_ease-in-out_infinite_reverse]"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-brand-200), transparent)",
        }}
      />
      <div
        className="absolute bottom-[-6%] left-[35%] h-[30rem] w-[30rem] rounded-full blur-3xl [animation:aurora-drift_26s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-aurora-cyan), transparent)",
        }}
      />
    </div>
  );
}
