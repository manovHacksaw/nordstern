import { put } from '@vercel/blob';

// Logo upload → Vercel Blob for the redeem branding step. The founder picks an image; we store
// it in Blob and return its public URL, which the form persists as the anchor's logo. Server-side
// only — BLOB_READ_WRITE_TOKEN never reaches the browser. Deliberately NOT under /api/* (that
// prefix is rewritten wholesale to platform-api in next.config), so this stays same-origin here.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ACCEPT = new Set(['image/png', 'image/svg+xml', 'image/jpeg', 'image/webp']);
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB — a logo, not a photo.

export async function POST(req: Request): Promise<Response> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return json(500, 'Logo uploads are not configured (missing BLOB_READ_WRITE_TOKEN).');

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) return json(400, 'No file provided.');
  if (!ACCEPT.has(file.type)) return json(400, 'Use a PNG, SVG, JPG, or WebP image.');
  if (file.size > MAX_BYTES) return json(400, 'Image must be under 2 MB.');

  const ext = file.type === 'image/svg+xml' ? 'svg' : file.type.split('/')[1];
  try {
    const blob = await put(`anchor-logos/${Date.now()}.${ext}`, file, {
      access: 'public',
      contentType: file.type,
      token,
    });
    return json(200, undefined, { url: blob.url });
  } catch (err) {
    return json(502, err instanceof Error ? err.message : 'Upload failed.');
  }
}

function json(status: number, error?: string, body?: Record<string, unknown>): Response {
  return new Response(JSON.stringify(error ? { error } : body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
