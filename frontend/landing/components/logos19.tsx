import { cn } from "@/lib/utils";

type LogosSimpleStaticLogo = Logo & {
  href?: string;
};
interface Logo {
  src: string;
  alt: string;
  srcDark?: string;
  className?: string;
}

interface LogosSimpleStaticProps {
  logos: LogosSimpleStaticLogo[];
  className?: string;
  /** Reverse the scroll direction (default scrolls left; reverse scrolls right). */
  reverse?: boolean;
}

type Props = Partial<LogosSimpleStaticProps>;

const defaultProps: LogosSimpleStaticProps = {
  logos: [
    {
      src: "https://clear.bank/uploads/Logos/New-homepage-ticker/Kraken-logo.svg",
      alt: "Company logo 1",
      className: "h-7 w-auto",
      href: "https://www.shadcnblocks.com",
    },
    {
      src: "https://clear.bank/uploads/Logos/New-homepage-ticker/Coinbase-Logo.svg",
      alt: "Company logo 2",
      className: "h-7 w-auto",
      href: "https://www.shadcnblocks.com",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/logos/fictional-company-logo-3.svg",
      alt: "Company logo 3",
      className: "h-7 w-auto",
      href: "https://www.shadcnblocks.com",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/logos/fictional-company-logo-4.svg",
      alt: "Company logo 4",
      className: "h-7 w-auto",
      href: "https://www.shadcnblocks.com",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/logos/fictional-company-logo-5.svg",
      alt: "Company logo 5",
      className: "h-5 w-auto",
      href: "https://www.shadcnblocks.com",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/logos/fictional-company-logo-6.svg",
      alt: "Company logo 6",
      className: "h-7 w-auto",
      href: "https://www.shadcnblocks.com",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/logos/fictional-company-logo-7.svg",
      alt: "Company logo 7",
      className: "h-7 w-auto",
      href: "https://www.shadcnblocks.com",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/logos/fictional-company-logo-8.svg",
      alt: "Company logo 8",
      className: "h-7 w-auto",
      href: "https://www.shadcnblocks.com",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/logos/fictional-company-logo-9.svg",
      alt: "Company logo 9",
      className: "h-7 w-auto",
      href: "https://www.shadcnblocks.com",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/logos/fictional-company-logo-10.svg",
      alt: "Company logo 10",
      className: "h-7 w-auto",
      href: "https://www.shadcnblocks.com",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/logos/fictional-company-logo-11.svg",
      alt: "Company logo 11",
      className: "h-7 w-auto",
      href: "https://www.shadcnblocks.com",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/logos/fictional-company-logo-12.svg",
      alt: "Company logo 12",
      className: "h-7 w-auto",
      href: "https://www.shadcnblocks.com",
    },
  ],
};

const Logos19 = (props: Props) => {
  const { logos, className, reverse } = {
    ...defaultProps,
    ...props,
  };

  return (
    <section className={cn("py-16", className)}>
      <div
        className="group relative flex overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 64px, black calc(100% - 64px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 64px, black calc(100% - 64px), transparent)",
        }}
      >
        {/* Two identical tracks; the animation shifts by exactly one track (-50%) for a seamless loop. */}
        {[0, 1].map((track) => (
          <ul
            key={track}
            aria-hidden={track === 1}
            className={cn(
              "flex shrink-0 items-center animate-[marquee-x_30s_linear_infinite] group-hover:paused motion-reduce:animate-none",
              reverse && "[animation-direction:reverse]",
            )}
          >
            {logos.map((logo, index) => (
              <li
                key={`${logo.src}-${index}`}
                className="mx-8 flex aspect-3/1 w-32 items-center justify-center sm:w-36 lg:mx-10"
              >
                <img
                  src={logo.src}
                  alt={track === 1 ? "" : logo.alt}
                  className={cn(
                    logo.className,
                    "h-auto max-h-8 w-auto object-contain dark:invert",
                  )}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
};

export { Logos19 };
