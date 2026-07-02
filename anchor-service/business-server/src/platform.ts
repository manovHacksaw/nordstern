import { PLATFORM_API_URL } from './config.js';

// ─── Platform API helpers ─────────────────────────────────────────────────────
// The business server advances transaction state via the Anchor Platform's
// Platform API. State is authoritative in the Platform DB (ARCHITECTURE §4).

export async function fetchTransaction(id: string): Promise<Record<string, any>> {
  const res = await fetch(`${PLATFORM_API_URL}/transactions/${id}`);
  if (!res.ok) throw new Error(`Platform GET ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function patchTransaction(id: string, fields: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${PLATFORM_API_URL}/transactions`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records: [{ transaction: { id, ...fields } }] }),
  });
  if (!res.ok) throw new Error(`Platform PATCH ${res.status}: ${await res.text()}`);
}

export async function listTransactions(params: Record<string, string>): Promise<any[]> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${PLATFORM_API_URL}/transactions?${qs}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.records ?? [];
}
