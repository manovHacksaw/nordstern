import { type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'surface' | 'noir' | 'outline' | 'glass';

const TONE: Record<Tone, string> = {
  surface: 'bg-surface',
  noir: 'bg-noir text-white',
  outline: 'border border-line bg-white',
  glass: 'border border-line bg-white/70 backdrop-blur-xl',
};

// Base card shell — consistent radius/tone. `interactive` adds the hover-lift used
// across the ecosystem. Radius defaults to the softer app radius (not the big landing card).
export function Card({
  children, className, tone = 'outline', interactive = false, radius = 'mock', as: Tag = 'div',
}: {
  children: ReactNode; className?: string; tone?: Tone; interactive?: boolean;
  radius?: 'mock' | 'card'; as?: ElementType;
}) {
  return (
    <Tag
      className={cn(
        'relative overflow-hidden',
        radius === 'card' ? 'rounded-card' : 'rounded-mock',
        TONE[tone],
        interactive && 'group transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/5',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
