import pg from 'pg';
import { DATABASE_URL } from './config.js';

// ─── Durable store (Postgres) ──────────────────────────────────────────────────
// The business-server is otherwise stateless (transaction state lives in the
// Anchor Platform DB). KYC is the one thing WE must persist: whether an account
// verified, when, and until when — so returning users skip KYC and expired ones
// re-verify. We reuse the stack's existing `anchordb` Postgres under a dedicated
// `nordstern` schema so we never collide with the AP's Flyway-managed tables.

const { Pool } = pg;

export const pool = new Pool({ connectionString: DATABASE_URL });

pool.on('error', (err) => console.error('[db] idle client error:', err.message));

// Idempotent DDL (CREATE … IF NOT EXISTS) — matches the template's lightweight,
// no-migration-framework style. Run once at startup before the server listens.
export async function initSchema(): Promise<void> {
  await pool.query('CREATE SCHEMA IF NOT EXISTS nordstern');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS nordstern.kyc_verifications (
      vendor_data       TEXT PRIMARY KEY,          -- SEP-10 account = our stable user id / DIDIT vendor id
      status            TEXT NOT NULL,             -- ACCEPTED | PROCESSING | NEEDS_INFO | REJECTED
      didit_session_id  TEXT,
      didit_session_url TEXT,                       -- reused so repeat clicks don't spam new sessions
      decision_summary  JSONB,                      -- redacted outcome only — never raw doc numbers/images
      verified_at       TIMESTAMPTZ,
      expires_at        TIMESTAMPTZ,                -- verified_at + KYC_REVERIFY_TTL_SECONDS
      updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  // Durable webhook idempotency — dedupe DIDIT deliveries on event_id.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS nordstern.kyc_webhook_events (
      event_id    TEXT PRIMARY KEY,
      received_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  // SEP-24 lets the initial request omit `amount`; the Anchor Platform's PATCH
  // /transactions endpoint has no field for setting amount_expected after the
  // fact (it only accepts amountIn/amountOut), so when we collect the amount
  // from the user in our own interactive form, we hold it here ourselves.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS nordstern.interactive_amounts (
      transaction_id TEXT PRIMARY KEY,
      amount         TEXT NOT NULL,
      created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  // Razorpay deposit collection (DEPOSIT_PROVIDER=razorpay). One row per deposit
  // transaction: the Razorpay order we created, the INR amount LOCKED at order
  // creation (never recomputed, so the charge, the display, and amount_in agree),
  // and the collection→release lifecycle. `status` is the money-safety guard:
  //   created  → order made, awaiting payment
  //   paid     → payment captured + verified server-side (release may proceed)
  //   releasing→ a single caller (webview return OR webhook) has atomically claimed
  //              the release (UPDATE … WHERE status='paid') — blocks double-send
  //   released → USDC sent + Platform tx completed
  //   failed   → release errored after claim; needs reconciliation
  await pool.query(`
    CREATE TABLE IF NOT EXISTS nordstern.razorpay_payments (
      transaction_id  TEXT PRIMARY KEY,
      order_id        TEXT UNIQUE,                 -- Razorpay order id (webhook looks us up by this)
      payment_id      TEXT,                        -- Razorpay payment id (set once captured)
      amount_usdc     TEXT NOT NULL,               -- USDC the user receives
      amount_inr      TEXT NOT NULL,               -- INR charged (locked at order creation)
      amount_paise    BIGINT NOT NULL,             -- amount_inr in paise (what Razorpay charged)
      inr_per_usdc    TEXT NOT NULL,               -- FX rate locked at order creation
      rate_source     TEXT,
      status          TEXT NOT NULL DEFAULT 'created',
      account         TEXT,                        -- SEP-10 account (KYC identity)
      destination     TEXT,                        -- Stellar address USDC is released to
      stellar_tx_hash TEXT,
      last_error      TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  // Durable webhook idempotency — dedupe Razorpay deliveries on X-Razorpay-Event-Id.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS nordstern.razorpay_webhook_events (
      event_id    TEXT PRIMARY KEY,
      received_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  console.log('[db] nordstern schema ready (kyc_verifications, kyc_webhook_events, interactive_amounts, razorpay_payments, razorpay_webhook_events)');
}
