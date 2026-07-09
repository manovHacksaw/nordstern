import type { NextConfig } from 'next';
import path from 'node:path';

// Proxy /api/* to the platform-api so the browser stays same-origin (cookies flow
// without CORS). Baked from API_URL at build time (standalone output).
const API_URL = process.env.API_URL ?? 'http://localhost:4000';

const config: NextConfig = {
  // Standalone (+ workspace-root tracing) is for the local Docker image. On Vercel both
  // must be OFF: the custom tracing root relocates `.next`, which breaks Vercel's post-build
  // output detection (ENOENT .next/package.json). Vercel handles the monorepo itself.
  output: process.env.VERCEL ? undefined : 'standalone',
  outputFileTracingRoot: process.env.VERCEL ? undefined : path.join(__dirname, '..'),
  transpilePackages: ['@nordstern/shared-ui', '@nordstern/shared-auth'],
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_URL}/api/:path*` }];
  },
};

export default config;
