import type { NextConfig } from 'next';

const netPass  = process.env.NETWORK_PASSPHRASE ?? 'Test SDF Network ; September 2015';
const isMainnet = netPass.includes('Public Global');

// Backend calls (/biz/*, /cp/*) are proxied via RUNTIME route handlers
// (app/biz/[...path], app/cp/[...path]) — NOT next.config rewrites, whose
// destinations are frozen at build time and can't carry the per-anchor BIZ_URL/CP_URL.
// See lib/proxy.ts. Network passphrase is network-level (same for all testnet anchors),
// so it's safe to bake into the browser bundle here.
const config: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_NET_PASS: netPass,
    NEXT_PUBLIC_IS_MAINNET: String(isMainnet),
  },
};

export default config;
