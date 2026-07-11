import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "outline" | "solid" | "mint" | "muted";

const VARIANT: Record<Variant, string> = {
  outline: "border border-line bg-white text-ink",
  solid: "bg-ink text-white",
  mint: "bg-brand-100 text-brand-800",
  muted: "bg-surface text-muted",
};

/** Small rounded label / chip. Used for eyebrow pills and status tags. */
export function Badge({
  children,
  className,
  variant = "outline",
}: {
  children: ReactNode;
  className?: string;
  variant?: Variant;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-medium",
        VARIANT[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
