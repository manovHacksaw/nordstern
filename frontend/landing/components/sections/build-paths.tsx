import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { BentoGrid } from "@/components/ui/bento-grid";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { CodeBlock } from "@/components/mockups/code-block";
import { ConsoleDashboard } from "@/components/mockups/console-dashboard";
import { BUILD_PATHS } from "@/lib/content";

export function BuildPaths() {
  return (
    <Section id="build" tone="surface">
      <SectionHeader
        eyebrow={BUILD_PATHS.eyebrow}
        title={BUILD_PATHS.title}
        lead={BUILD_PATHS.lead}
        className="max-w-2xl"
      />

      <Stagger className="mt-14">
        <BentoGrid cols={2}>
          {BUILD_PATHS.paths.map((path) => (
            <StaggerItem key={path.title}>
              <Card as="a" tone="outline" interactive className="flex h-full flex-col">
                <div className="rounded-mock bg-surface p-5">
                  {path.variant === "code" ? (
                    <CodeBlock />
                  ) : (
                    <div className="pointer-events-none scale-[0.98]">
                      <ConsoleDashboard view="overview" />
                    </div>
                  )}
                </div>
                <div className="mt-6 flex items-start justify-between">
                  <h3 className="text-2xl font-medium tracking-tight">
                    {path.title}
                  </h3>
                  <IconButton filled={path.variant === "dashboard"} />
                </div>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
                  {path.body}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {path.chips.map((c) => (
                    <Badge key={c} variant="muted">
                      {c}
                    </Badge>
                  ))}
                </div>
              </Card>
            </StaggerItem>
          ))}
        </BentoGrid>
      </Stagger>
    </Section>
  );
}
