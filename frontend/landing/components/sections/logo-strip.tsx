import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { BACKERS } from "@/lib/content";

/** Monochrome social-proof row. */
export function LogoStrip() {
  return (
    <section className="border-y border-line py-10">
      <Container>
        <Reveal
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:justify-between"
          y={16}
        >
          {BACKERS.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold tracking-tight text-subtle transition-colors hover:text-muted"
            >
              {name}
            </span>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
