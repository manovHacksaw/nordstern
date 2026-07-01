import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "surface" | "noir" | "outline";

const TONE: Record<Tone, string> = {
  surface: "bg-surface",
  noir: "bg-noir text-white",
  outline: "border border-line bg-white",
};

/**
 * Base card shell — consistent radius/padding/tone. Pass `as="a"`/`href` via
 * the wrapping element for links. `interactive` adds the group hover lift used
 * across feature/bento cards.
 */
export function Card({
  children,
  className,
  tone = "surface",
  interactive = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  interactive?: boolean;
  as?: ElementType;
}) {
  return (
    <Tag
      className={cn(
        "relative overflow-hidden rounded-card p-6 sm:p-8",
        TONE[tone],
        interactive &&
          "group transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
