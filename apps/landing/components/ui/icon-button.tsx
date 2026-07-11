import { cn } from "@/lib/cn";
import { ArrowUpRight } from "./icons";

/**
 * Circular arrow affordance used on cards. Default is outlined; `filled`
 * inverts to solid ink (the reference's hover state). Purely decorative when
 * the whole card is a link — hence aria-hidden.
 */
export function IconButton({
  filled = false,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full text-lg transition-colors duration-300",
        filled
          ? "bg-ink text-white"
          : "border border-line bg-white/60 text-ink group-hover:bg-ink group-hover:text-white group-hover:border-ink",
        className,
      )}
    >
      <ArrowUpRight />
    </span>
  );
}
