// Runtime reverse-proxy for the customer app's backend calls. next.config rewrites
// CANNOT be used: their destinations are frozen into the routes manifest at BUILD
// time, but BIZ_URL/CP_URL are per-anchor and injected at RUNTIME. Route handlers read
// process.env at request time, so one image proxies correctly for every anchor.
// lib/api.ts is untouched — same /biz/* and /cp/* paths.
const STRIP = new Set(['host', 'connection', 'content-length', 'content-encoding', 'transfer-encoding']);

export async function proxy(req: Request, targetUrl: string): Promise<Response> {
  const headers = new Headers();
  req.headers.forEach((v, k) => { if (!STRIP.has(k.toLowerCase())) headers.set(k, v); });

  const init: RequestInit = { method: req.method, headers, redirect: 'manual' };
  if (req.method !== 'GET' && req.method !== 'HEAD') init.body = await req.arrayBuffer();

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, init);
  } catch {
    return new Response(JSON.stringify({ error: 'Upstream service unreachable' }), {
      status: 502, headers: { 'content-type': 'application/json' },
    });
  }

  const respHeaders = new Headers();
  upstream.headers.forEach((v, k) => { if (!STRIP.has(k.toLowerCase())) respHeaders.set(k, v); });
  return new Response(upstream.body, { status: upstream.status, headers: respHeaders });
}
