import Link from "next/link";
import { ICONS } from "@/components/ui/icon-map";
import { ArrowUpRight } from "@/components/ui/icons";
import type { NavMenu } from "@/lib/content";

/** Column heading with a hairline divider — matches the reference labels. */
function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 border-b border-line pb-3 text-[15px] font-normal text-subtle">
      {children}
    </p>
  );
}

/** Icon + title + description link row. */
function Row({
  icon,
  title,
  desc,
  href,
}: {
  icon: string;
  title: string;
  desc: string;
  href: string;
}) {
  const Icon = ICONS[icon];
  return (
    <Link
      href={href}
      className="group/row -mx-3 flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-surface"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface text-[19px] text-ink transition-colors group-hover/row:bg-white">
        {Icon ? <Icon /> : null}
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-medium leading-tight text-ink">
          {title}
        </span>
        <span className="mt-1 block text-[13px] leading-snug text-muted">{desc}</span>
      </span>
    </Link>
  );
}

/**
 * Config-driven mega-menu content: two link columns + a featured card column.
 * Presentational only — the navbar owns open/close state and animation, so this
 * panel is reusable for any nav item (or future dropdowns).
 */
export function MegaMenu({ menu }: { menu: NavMenu }) {
  return (
    <div className="grid grid-cols-[1fr_1fr_0.85fr] gap-x-12">
      {menu.columns.map((col) => (
        <div key={col.label}>
          <ColumnLabel>{col.label}</ColumnLabel>
          <div className="space-y-1.5">
            {col.items.map((it) => (
              <Row key={it.title} {...it} />
            ))}
          </div>
        </div>
      ))}

      <div>
        <ColumnLabel>{menu.featured.label}</ColumnLabel>
        <div className="space-y-3">
          {menu.featured.cards.map((c) => {
            const Icon = ICONS[c.icon];
            return (
              <Link
                key={c.title}
                href={c.href}
                className="group/card flex items-center gap-3 rounded-xl bg-surface px-4 py-5 transition-colors hover:bg-surface-2"
              >
                <span className="text-[19px] text-ink">{Icon ? <Icon /> : null}</span>
                <span className="text-[15px] font-medium text-ink">{c.title}</span>
                <ArrowUpRight className="ml-auto text-subtle transition-transform duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
