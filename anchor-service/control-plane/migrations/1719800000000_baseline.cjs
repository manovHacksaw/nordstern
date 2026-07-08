/* eslint-disable */
// R6 M4.1 — Control Plane baseline migration.
//
// Captures the exact live schema that `initDb()` produced (byte-for-byte DDL), kept
// FULLY IDEMPOTENT (CREATE TABLE IF NOT EXISTS / ALTER … IF NOT EXISTS) so that:
//   • a fresh database is created correctly, and
//   • an EXISTING control-plane database (already built by initDb) adopts migrations
//     seamlessly — this baseline runs as a harmless no-op and is then recorded as
//     applied, with zero risk to existing tenants/provisioning data.
// Future schema changes are normal additive migrations (not idempotent).

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    -- ── Operators (users) ──────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS users (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email         VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role          VARCHAR(50)  DEFAULT 'fi-operator',
      created_at    TIMESTAMPTZ  DEFAULT NOW()
    );

    -- Legacy DBs had users.tenant_id NOT NULL — relax it so operator-only
    -- registration works without a tenant.
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='users' AND column_name='tenant_id') THEN
        ALTER TABLE users ALTER COLUMN tenant_id DROP NOT NULL;
      END IF;
    END $$;

    -- ── Anchors (table kept as \`tenants\` to minimise churn — DL-005) ────────────
    CREATE TABLE IF NOT EXISTS tenants (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name         VARCHAR(255) NOT NULL,
      slug         VARCHAR(100) UNIQUE NOT NULL,
      status       VARCHAR(50)  DEFAULT 'pending',
      network      VARCHAR(20)  DEFAULT 'testnet',
      fiat_balance DECIMAL(18,2) DEFAULT 100000.00,
      created_at   TIMESTAMPTZ  DEFAULT NOW()
    );

    -- Anchor-factory columns (idempotent).
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS owner_user_id   UUID REFERENCES users(id);
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS subdomain       VARCHAR(100);
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS home_domain     VARCHAR(255);
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS asset_code      VARCHAR(12);
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS asset_issuer    VARCHAR(60);
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS stack_status    VARCHAR(30) DEFAULT 'pending';
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS status_detail   TEXT;
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS ap_container_id  VARCHAR(100);
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS biz_container_id VARCHAR(100);

    -- Business Profile extensions
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS legal_entity_name       VARCHAR(255);
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS company_type            VARCHAR(100);
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS use_case                VARCHAR(100);
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS country                 VARCHAR(50);
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS fiu_registration_status VARCHAR(50);
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS support_email           VARCHAR(255);
    -- White-label brand identity (open jsonb).
    ALTER TABLE tenants ADD COLUMN IF NOT EXISTS branding                JSONB DEFAULT '{}'::jsonb;

    -- ── Encrypted secret vault ──────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS anchor_secrets (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id  UUID REFERENCES tenants(id),
      role       VARCHAR(50)  NOT NULL,
      public_key VARCHAR(60)  NOT NULL,
      ciphertext TEXT NOT NULL,
      iv         TEXT NOT NULL,
      tag        TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Defensive: drop any legacy plaintext secret column (DL-007).
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='tenant_keypairs' AND column_name='secret_key') THEN
        ALTER TABLE tenant_keypairs DROP COLUMN secret_key;
      END IF;
    END $$;

    -- ── Per-anchor adapter selection + (encrypted) vendor credentials ───────────
    CREATE TABLE IF NOT EXISTS anchor_adapters (
      tenant_id        UUID PRIMARY KEY REFERENCES tenants(id),
      kyc_provider     VARCHAR(50) DEFAULT 'mock',
      deposit_provider VARCHAR(50) DEFAULT 'mock',
      payout_provider  VARCHAR(50) DEFAULT 'mock',
      fee_provider     VARCHAR(50) DEFAULT 'mock',
      credentials_enc  TEXT,
      credentials_iv   TEXT,
      credentials_tag  TEXT,
      updated_at       TIMESTAMPTZ DEFAULT NOW()
    );

    -- ── Business rules ──────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS tenant_config (
      tenant_id            UUID PRIMARY KEY REFERENCES tenants(id),
      min_deposit          DECIMAL(18,2) DEFAULT 10,
      max_deposit          DECIMAL(18,2) DEFAULT 10000,
      min_withdrawal       DECIMAL(18,2) DEFAULT 10,
      max_withdrawal       DECIMAL(18,2) DEFAULT 5000,
      daily_limit          DECIMAL(18,2) DEFAULT 25000,
      deposit_fee_pct      DECIMAL(6,4)  DEFAULT 0.015,
      withdrawal_fee_pct   DECIMAL(6,4)  DEFAULT 0.010,
      fiat_method_name     VARCHAR(100)  DEFAULT 'Wire Transfer',
      fiat_bank_name       VARCHAR(255)  DEFAULT '',
      fiat_account_number  VARCHAR(100)  DEFAULT '',
      fiat_routing_number  VARCHAR(50)   DEFAULT '',
      settlement_days      INTEGER       DEFAULT 1,
      alert_mismatch_pct   DECIMAL(6,4)  DEFAULT 0.01,
      alert_large_tx       DECIMAL(18,2) DEFAULT 5000,
      webhook_url          VARCHAR(500)  DEFAULT '',
      updated_at           TIMESTAMPTZ   DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS reconciliation_alerts (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id    UUID REFERENCES tenants(id),
      fiat_balance DECIMAL(18,2),
      onchain_balance DECIMAL(18,2),
      delta        DECIMAL(18,2),
      resolved     BOOLEAN DEFAULT false,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    );
  `);
};

exports.down = (pgm) => {
  // Reverse order (respect FKs). Baseline down is destructive by nature.
  pgm.sql(`
    DROP TABLE IF EXISTS reconciliation_alerts;
    DROP TABLE IF EXISTS tenant_config;
    DROP TABLE IF EXISTS anchor_adapters;
    DROP TABLE IF EXISTS anchor_secrets;
    DROP TABLE IF EXISTS tenants;
    DROP TABLE IF EXISTS users;
  `);
};
