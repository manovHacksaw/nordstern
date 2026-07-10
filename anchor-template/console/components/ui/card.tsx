import * as React from 'react';
import { cn } from '@/lib/cn';

// Premium card system (matches the landing "Kori" console mock): soft 20px radius, hairline
// border, layered shadow, deep-charcoal ink. Shared by every console page, so restyling here
// upgrades the whole console at once.
export const Card = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-[20px] border border-black/[0.05] bg-white text-[#1c1b26]',
      'shadow-[0_1px_2px_rgba(24,22,54,0.04),0_10px_30px_-20px_rgba(24,22,54,0.16)]',
      className,
    )}
    {...p}
  />
);
export const CardHeader = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1 p-5', className)} {...p} />
);
export const CardTitle = ({ className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-[13.5px] font-semibold tracking-tight text-[#1c1b26]', className)} {...p} />
);
export const CardDescription = ({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-[12.5px] leading-relaxed text-muted-foreground', className)} {...p} />
);
export const CardContent = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-5 pt-0', className)} {...p} />
);
export const CardFooter = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center p-5 pt-0', className)} {...p} />
);
