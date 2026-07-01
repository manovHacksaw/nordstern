import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Responsive grid used for card sections. `cols` sets the desktop column count;
 * everything collapses to a single column on mobile.
 */
export function BentoGrid({
  children,
  className,
  cols = 2,
}: {
  children: ReactNode;
  className?: string;
  cols?: 2 | 3;
}) {
  return (
    <div
      className={cn(
        "grid gap-5 sm:gap-6",
        cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
