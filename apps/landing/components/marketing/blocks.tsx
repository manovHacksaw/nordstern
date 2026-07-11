import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heading, Eyebrow, Text } from "@/components/ui/typography";
import { Aurora } from "@/components/motion/aurora";
import { ArrowRight, ArrowUpRight, Check, ChevronRight } from "@/components/ui/icons";
import { ICONS } from "@/components/ui/icon-map";
import { EXTERNAL, ROUTES, SECTIONS, isExternal } from "@/lib/links";
import { cn } from "@/lib/cn";

/** next/link props with new-tab attrs auto-applied for off-site destinations. */
function linkProps(href: string) {
  return isExternal(href)
    ? { href, target: "_blank" as const, rel: "noreferrer" }
    : { href };
}

/** A link that becomes a plain <a> (new tab) off-site, else a next/link. */
export function SmartLink({
  href,
  className,
  children,
  ...rest
}: { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href">) {
  return (
    <Link className={className} {...linkProps(href)} {...rest}>
      {children}
    </Link>
  );
}

export type Action = { label: string; href: string };

/** Page hero: eyebrow + title + lead + optional primary/secondary actions. */
export function PageHero({
  eyebrow,
  title,
  lead,
  primary,
  secondary,
  badge,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  primary?: Action;
  secondary?: Action;
  badge?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-canvas">
      <Aurora intensity="soft" className="opacity-30" />
      <Container className="py-20 sm:py-28 lg:py-32">
        <div className="max-w-3xl">
          {badge ? (
            <Badge variant="mint" className="mb-5">
              {badge}
            </Badge>
          ) : eyebrow ? (
            <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
          ) : null}
          <Heading as="h1" size="display" className="text-ink">
            {title}
          </Heading>
          {lead ? <Text className="mt-6 max-w-2xl text-[19px]">{lead}</Text> : null}
          {primary || secondary ? (
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              {primary ? (
                <Button href={primary.href} variant="primary" {...(isExternal(primary.href) ? { target: "_blank", rel: "noreferrer" } : {})}>
                  {primary.label}
                  <ChevronRight className="text-white/70" />
                </Button>
              ) : null}
              {secondary ? (
                <SmartLink
                  href={secondary.href}
                  className="group inline-flex items-center gap-1 text-[15px] font-medium text-ink"
                >
                  <span className="underline decoration-line decoration-1 underline-offset-[5px] transition-colors group-hover:decoration-ink">
                    {secondary.label}
                  </span>
                  <ChevronRight className="text-subtle transition-transform group-hover:translate-x-0.5" />
                </SmartLink>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/** Grid of icon + title + body feature cards (icons from the shared ICON map). */
export function FeatureGrid({
  items,
  columns = 3,
}: {
  items: { icon?: string; title: string; body: ReactNode; href?: string }[];
  columns?: 2 | 3;
}) {
  return (
    <div
      className={cn(
        "grid gap-5",
        columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {items.map((it) => {
        const Icon = it.icon ? ICONS[it.icon] : null;
        const inner = (
          <>
            {Icon ? (
              <span className="grid size-11 place-items-center rounded-xl bg-brand-100 text-[20px] text-brand-800">
                <Icon />
              </span>
            ) : null}
            <h3 className="mt-5 text-lg font-medium text-ink">{it.title}</h3>
            <div className="mt-2 text-[15px] leading-relaxed text-muted">{it.body}</div>
            {it.href ? (
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
                Learn more
                <ArrowUpRight className="size-4" />
              </span>
            ) : null}
          </>
        );
        return it.href ? (
          <SmartLink
            key={it.title}
            href={it.href}
            className="group rounded-card border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 sm:p-7"
          >
            {inner}
          </SmartLink>
        ) : (
          <div
            key={it.title}
            className="rounded-card border border-line bg-white p-6 sm:p-7"
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/** Numbered step list (roadmap / how-it-works). */
export function Steps({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <ol className="space-y-4">
      {items.map((s, i) => (
        <li
          key={s.title}
          className="flex gap-5 rounded-card border border-line bg-white p-6"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-sm font-medium text-white">
            {i + 1}
          </span>
          <div>
            <h3 className="text-lg font-medium text-ink">{s.title}</h3>
            <div className="mt-1.5 text-[15px] leading-relaxed text-muted">{s.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Checklist of short bullets. */
export function CheckList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
          <Check className="mt-1 size-4 shrink-0 text-brand-700" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** List of links (docs / resources / related pages). */
export function LinkList({
  items,
}: {
  items: { label: string; href: string; desc?: string }[];
}) {
  return (
    <ul className="divide-y divide-line rounded-card border border-line bg-white">
      {items.map((it) => (
        <li key={it.label}>
          <SmartLink
            href={it.href}
            className="group flex items-center gap-4 p-5 transition-colors hover:bg-surface"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium text-ink">{it.label}</span>
              {it.desc ? (
                <span className="mt-0.5 block text-sm text-muted">{it.desc}</span>
              ) : null}
            </span>
            {isExternal(it.href) ? (
              <ArrowUpRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            ) : (
              <ArrowRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5" />
            )}
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}

/** Content section on the marketing sub-pages: header + children. */
export function Block({
  eyebrow,
  title,
  lead,
  children,
  tone = "canvas",
  id,
}: {
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  tone?: "canvas" | "surface";
  id?: string;
}) {
  return (
    <Section id={id} tone={tone} className="!py-16 sm:!py-20 lg:!py-24">
      {title ? (
        <div className="mb-10 max-w-2xl">
          {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
          <Heading size="h2" className="text-ink">
            {title}
          </Heading>
          {lead ? <Text className="mt-4 max-w-2xl">{lead}</Text> : null}
        </div>
      ) : null}
      {children}
    </Section>
  );
}

/** Long-form prose wrapper for legal / editorial pages. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <Section tone="canvas" className="!py-16 sm:!py-20">
      <div className="prose-nord max-w-2xl text-[15px] leading-relaxed text-ink [&_a]:text-brand-700 [&_a:hover]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-medium [&_p]:mt-4 [&_p]:text-muted [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:text-muted">
        {children}
      </div>
    </Section>
  );
}

/** Dark closing CTA band, mirrors the homepage FinalCTA. */
export function CtaBand({
  title = "Launch your anchor with NordStern.",
  body,
  primary = { label: "Talk to us", href: EXTERNAL.register },
  secondary,
}: {
  title?: string;
  body?: string;
  primary?: Action;
  secondary?: Action;
}) {
  return (
    <Section tone="noir" className="overflow-hidden text-center">
      <Aurora intensity="soft" className="opacity-25" />
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <Heading className="text-white">{title}</Heading>
        {body ? <Text className="mt-4 max-w-xl text-white/70">{body}</Text> : null}
        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
          <Button
            href={primary.href}
            variant="white"
            {...(isExternal(primary.href) ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {primary.label}
          </Button>
          {secondary ? (
            <SmartLink
              href={secondary.href}
              className="inline-flex items-center gap-1 text-[15px] font-medium text-white/80 hover:text-white"
            >
              {secondary.label}
              <ChevronRight className="size-4" />
            </SmartLink>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

/** "Coming soon" explainer block: what it is, why, what's coming, who it's for. */
export function ComingSoon({
  what,
  why,
  coming,
  audience,
  cta,
}: {
  what: ReactNode;
  why: ReactNode;
  coming: ReactNode[];
  audience: ReactNode;
  cta?: Action;
}) {
  return (
    <>
      <Block tone="canvas">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-card border border-line bg-white p-7">
            <Eyebrow className="mb-3">What it is</Eyebrow>
            <div className="text-[15px] leading-relaxed text-muted">{what}</div>
          </div>
          <div className="rounded-card border border-line bg-white p-7">
            <Eyebrow className="mb-3">Why it exists</Eyebrow>
            <div className="text-[15px] leading-relaxed text-muted">{why}</div>
          </div>
        </div>
      </Block>
      <Block tone="surface" title="What's coming" eyebrow="On the roadmap">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <CheckList items={coming} />
          <div className="rounded-card border border-line bg-white p-7">
            <Eyebrow className="mb-3">Who it&apos;s for</Eyebrow>
            <div className="text-[15px] leading-relaxed text-muted">{audience}</div>
            <div className="mt-6">
              <Button href={(cta ?? { href: EXTERNAL.register }).href} variant="primary" {...(isExternal((cta ?? { href: EXTERNAL.register }).href) ? { target: "_blank", rel: "noreferrer" } : {})}>
                {(cta ?? { label: "Talk to us" }).label ?? "Talk to us"}
              </Button>
            </div>
          </div>
        </div>
      </Block>
    </>
  );
}

/** Convenience re-exports for pages. */
export { ROUTES, SECTIONS, EXTERNAL };
