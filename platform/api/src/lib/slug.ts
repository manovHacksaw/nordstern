export function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

// Slugs an anchor may NEVER use: each anchor is served at `<slug>.nordstern.live` (and
// `console-<slug>.…`), so a slug that matches a platform host would hijack it. Keep in sync
// with the control-plane guard (anchor-service/control-plane/src/provision.ts).
export const RESERVED_SLUGS = new Set([
  'admin', 'register', 'console', 'api', 'sep', 'www', 'app', 'auth', 'docs',
  'mail', 'status', 'dashboard', 'anchors', 'aggregator', 'platform', 'nordstern',
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

/** Slugify `base`, then ensure uniqueness against `exists`. */
export async function uniqueSlug(base: string, exists: (s: string) => Promise<boolean>): Promise<string> {
  const root = slugify(base) || 'org';
  if (!(await exists(root))) return root;
  for (let i = 0; i < 100; i++) {
    const candidate = `${root}-${Math.random().toString(36).slice(2, 6)}`;
    if (!(await exists(candidate))) return candidate;
  }
  return `${root}-${Date.now()}`;
}
