import { proxy } from '@/lib/proxy';

// /cp/* → control-plane (preserved from the previous rewrite; used by legacy operator
// views). Runtime target, same reasoning as /biz.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const CP_URL = () => process.env.CP_URL ?? 'http://localhost:3002';

function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/cp/, '') || '/';
  return proxy(req, `${CP_URL()}${path}${url.search}`);
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
