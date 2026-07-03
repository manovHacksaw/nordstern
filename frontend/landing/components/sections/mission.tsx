import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { MISSION } from "@/lib/content";

/**
 * Editorial mission statement: one large, left-aligned paragraph whose leading
 * clause reads in ink and whose tail fades to gray (reference two-tone). Set in
 * the low-weight display type shared with the section headings.
 */
export function Mission() {
  return (
    <Section id="mission">
      <Reveal>
        <p className="max-w-[65rem] text-[clamp(1.3rem,2.5vw,2rem)] font-normal leading-[1.2] tracking-[-0.02em] text-pretty pl-8">
          <span className="text-ink">{MISSION.lead}</span>
          <span className="text-subtle">{MISSION.tail}</span>
        </p>
      </Reveal>
    </Section>
  );
}
