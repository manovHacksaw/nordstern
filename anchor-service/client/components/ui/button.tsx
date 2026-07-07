import { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'brand' | 'secondary' | 'ghost' | 'white';
type Size = 'sm' | 'md' | 'lg';

// `brand` uses the per-anchor accent (--color-brand) so CTAs re-tint white-label.
const VARIANT: Record<Variant, string> = {
  primary: 'bg-ink text-white hover:bg-ink/90',
  brand: 'bg-brand text-[var(--color-brand-ink)] hover:opacity-90',
  secondary: 'bg-surface text-ink hover:bg-surface-2',
  ghost: 'border border-line bg-transparent text-ink hover:bg-surface',
  white: 'bg-white text-ink hover:bg-white/90',
};

const SIZE: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[15px]',
  lg: 'h-12 px-7 text-base',
};

const base =
  'inline-flex select-none items-center justify-center gap-2 rounded-pill font-medium transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none';

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & (
  | ({ href: string } & ComponentPropsWithoutRef<typeof Link>)
  | ({ href?: undefined } & ComponentPropsWithoutRef<'button'>)
);

// Pill button. Renders a Next <Link> when `href` is passed, else a <button>.
export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const classes = cn(base, VARIANT[variant], SIZE[size], className);
  if ('href' in props && props.href !== undefined) {
    return <Link className={classes} {...(props as ComponentPropsWithoutRef<typeof Link>)}>{children}</Link>;
  }
  return <button className={classes} {...(props as ComponentPropsWithoutRef<'button'>)}>{children}</button>;
}
