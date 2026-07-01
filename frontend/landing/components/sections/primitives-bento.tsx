import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { BentoGrid } from "@/components/ui/bento-grid";
import { ICONS } from "@/components/ui/icon-map";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { PRIMITIVES } from "@/lib/content";

export function PrimitivesBento() {
  return (
    <Section id="platform" tone="canvas">
      <SectionHeader
        eyebrow={PRIMITIVES.eyebrow}
        title={PRIMITIVES.title}
        lead={PRIMITIVES.lead}
        className="max-w-2xl"
      />

      <Stagger className="mt-14">
        <BentoGrid cols={2}>
          {PRIMITIVES.items.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <StaggerItem key={item.title}>
                <Card
                  as="a"
                  interactive
                  className="flex h-full min-h-[16rem] flex-col"
                >
                  {/* hover aurora wash */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(120% 120% at 100% 0%, var(--color-aurora-mint), var(--color-brand-100) 45%, transparent 75%)",
                    }}
                  />
                  <div className="flex items-start justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-brand-100 text-xl text-brand-700">
                      <Icon />
                    </span>
                    <IconButton />
                  </div>
                  <h3 className="mt-6 text-xl font-medium tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
                    {item.body}
                  </p>
                </Card>
              </StaggerItem>
            );
          })}
        </BentoGrid>
      </Stagger>
    </Section>
  );
}
