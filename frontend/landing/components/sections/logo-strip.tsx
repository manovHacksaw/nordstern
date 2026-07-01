import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { BACKERS } from "@/lib/content";

/** Monochrome social-proof row. Image logos render muted; the rest are set in type. */
export function LogoStrip() {
  return (
    <section className="border-y border-line py-10">
      <Container>
        <Reveal
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:justify-between"
          y={16}
        >
          {BACKERS.map((b) =>
            b.logo ? (
              <Image
                key={b.name}
                src={b.logo.src}
                alt={b.name}
                width={b.logo.width}
                height={b.logo.height}
                className="h-6 w-auto opacity-45 grayscale transition-opacity hover:opacity-70"
              />
            ) : (
              <span
                key={b.name}
                className="text-lg font-semibold tracking-tight text-subtle transition-colors hover:text-muted"
              >
                {b.name}
              </span>
            ),
          )}
        </Reveal>
      </Container>
    </section>
  );
}
