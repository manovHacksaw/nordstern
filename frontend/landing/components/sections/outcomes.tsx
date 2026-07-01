import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { BentoGrid } from "@/components/ui/bento-grid";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { OUTCOMES } from "@/lib/content";

export function Outcomes() {
  return (
    <Section id="outcomes">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow={OUTCOMES.eyebrow}
          title={OUTCOMES.title}
          lead={OUTCOMES.lead}
          className="max-w-xl"
        />
        <Button href={OUTCOMES.cta.href} variant="ghost" size="sm">
          {OUTCOMES.cta.label}
        </Button>
      </div>

      <Stagger className="mt-14">
        <BentoGrid cols={3}>
          {OUTCOMES.stats.map((s) => (
            <StaggerItem key={s.brand}>
              <Card tone="noir" interactive className="flex h-full min-h-[15rem] flex-col justify-between">
                <p className="text-sm font-semibold text-white/70">{s.brand}</p>
                <p className="mt-3 max-w-[16rem] text-lg leading-snug">{s.title}</p>
                <div className="mt-auto flex items-end justify-between pt-8">
                  <div>
                    <p className="bg-gradient-to-r from-brand-200 via-brand to-[color:var(--color-aurora-cyan)] bg-clip-text text-5xl font-medium tracking-tight text-transparent">
                      {s.value}
                    </p>
                    <p className="mt-1 text-sm text-white/60">{s.caption}</p>
                  </div>
                  <IconButton className="border-white/15 bg-white/5 text-white group-hover:bg-white group-hover:text-ink" />
                </div>
              </Card>
            </StaggerItem>
          ))}
        </BentoGrid>
      </Stagger>
    </Section>
  );
}
