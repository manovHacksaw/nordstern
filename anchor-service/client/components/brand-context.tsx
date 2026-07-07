'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Brand } from '@/lib/brand';

// Makes the server-resolved Brand available to client components (header, buy panel,
// footer). The accent itself is applied as a CSS var on <html> in layout.tsx, so
// styling re-tints automatically; this context is for text/labels (name, asset, currency).
const Ctx = createContext<Brand | null>(null);

export function BrandProvider({ brand, children }: { brand: Brand; children: ReactNode }) {
  return <Ctx.Provider value={brand}>{children}</Ctx.Provider>;
}

export function useBrand(): Brand {
  const b = useContext(Ctx);
  if (!b) throw new Error('useBrand must be used within BrandProvider');
  return b;
}
