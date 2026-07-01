import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Centered content column with responsive gutters. Caps width on ultrawide. */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Tag>
  );
}
