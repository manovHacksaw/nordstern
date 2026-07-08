import { cn } from '@/lib/cn';

// Ambient purple-forward aurora: blurred gradient blobs with slow CSS drift. Server
// component (no JS). Drop into any `relative` container; fills behind via -z-10. The
// primary blob uses --color-brand so it re-tints with the per-anchor accent.
export function Aurora({
  className, intensity = 'medium',
}: { className?: string; intensity?: 'soft' | 'medium' | 'strong' }) {
  const opacity = intensity === 'soft' ? 'opacity-40' : intensity === 'strong' ? 'opacity-80' : 'opacity-60';
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', opacity, className)}>
      <div
        className="absolute -left-[10%] top-[8%] h-[34rem] w-[34rem] rounded-full blur-3xl [animation:aurora-drift_18s_ease-in-out_infinite]"
        style={{ background: 'radial-gradient(closest-side, var(--color-brand-200), transparent)' }}
      />
      <div
        className="absolute right-[-8%] top-[24%] h-[30rem] w-[30rem] rounded-full blur-3xl [animation:aurora-drift_22s_ease-in-out_infinite_reverse]"
        style={{ background: 'radial-gradient(closest-side, var(--color-brand), transparent)' }}
      />
      <div
        className="absolute bottom-[-6%] left-[35%] h-[28rem] w-[28rem] rounded-full blur-3xl [animation:aurora-drift_26s_ease-in-out_infinite]"
        style={{ background: 'radial-gradient(closest-side, var(--color-aurora-cyan), transparent)' }}
      />
    </div>
  );
}
