import { type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

// Centered content column with responsive gutters. App content is narrower than the
// marketing site, so this caps tighter than the landing Container.
export function Container({
  children, className, as: Tag = 'div',
}: { children: ReactNode; className?: string; as?: ElementType }) {
  return <Tag className={cn('mx-auto w-full max-w-6xl px-5 sm:px-8', className)}>{children}</Tag>;
}
