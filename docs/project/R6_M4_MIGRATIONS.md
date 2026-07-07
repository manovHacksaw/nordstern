# R6 M4 — Versioned Migrations

> Bring every service's schema evolution under versioned, reviewable, CI-validated
> migrations. Execution roadmap from `R6_M2c_DB_VALIDATION.md`. No new ORM.

## M4.0 — platform/api drift resolved ✅ (this increment)

The drift M2-c surfaced (schema.ts ahead of migrations) is now captured as versioned
Drizzle migrations — the highest immediate risk, because a fresh `db:migrate`
(production path) was previously missing `secret_refs` + `anchors.branding`.

- **`0002_drop_legacy_app_cols_add_secret_refs`** — creates `secret_refs` (+ FKs, indexes),
  adds `anchors.branding`, drops the legacy `applications.{stellar_cfg, payment_rails, compliance}` columns.
- **`0003_add_application_product`** — adds `applications.product`.

The `applications` restructure carried a rename-vs-drop ambiguity (`product` vs the
three dropped columns). Resolved deterministically as **drop + add** — `product` is a
genuinely new column from the R2 onboarding redesign, not a rename — by generating in
two unambiguous steps (no fragile interactive prompts). `schema.ts` was **not** edited;
the drift was fixed by generating the missing migrations.

**Verified:**
- `drizzle-kit check` → consistent.
- Full chain `0000→0003` **applies cleanly to a fresh Postgres**; resulting schema
  matches `schema.ts` (applications = id/profile/product/status/created_at/updated_at;
  `secret_refs` present; `anchors.branding` present).
- `drizzle-kit generate` → "No schema changes" (drift gone).

**CI hardened (`db.yml`):** the drift check is now **blocking** (was advisory in M2-c),
and a new step **applies the migrations to a real Postgres service** on every
platform/api PR. So from now on any `schema.ts` change without a matching migration
**fails CI**.

> Note: `0003` adds `product` as `NOT NULL` with no default — safe on fresh deploys
> (table empty). If `applications` ever needs migrating with existing rows, add a
> backfill/default first.

## Remaining increments (raw-SQL services — same pattern each)

Order and rationale unchanged from the M2-c roadmap. Each is its own reviewable PR:

### M4.1 — control-plane (`controldb`) ✅ (done)
- Introduced **node-pg-migrate** (raw `pg`; no new ORM).
- **Baseline** (`migrations/1719800000000_baseline.cjs`) = the exact `initDb()` DDL kept
  **fully idempotent** (`IF NOT EXISTS`), so existing control-plane DBs adopt migrations
  as a harmless no-op and fresh DBs are created. `initDb()` runtime DDL removed;
  `src/migrate.ts` runs **migrate-on-start** from `index.ts`.
- Dockerfile now ships `migrations/` into the runtime image.
- **Verified against real Postgres:** migrations reproduce the `initDb()` schema
  **byte-for-byte**; re-run is a no-op (idempotent); running against an existing
  initDb-built DB leaves all tenant/provisioning tables intact (backwards compatible);
  the built image boots, migrates on start, serves `/health`.
- **CI (`db.yml` `control-plane-migrations` job):** apply-on-fresh-DB (blocking),
  idempotency (blocking), and a **no-un-versioned-runtime-DDL guard** (blocking) — the
  raw-SQL analog of drift detection (all schema changes must be migrations).
- `db.yml` restructured into per-service jobs + a deadlock-safe **`db-required`**
  aggregation (also fixes a latent required-check/path-filter deadlock).
- Rollback: baseline ships a `down`; future migrations additive with `down`s.

### M4.2 — business-server (per-anchor `nordstern`) — highest value
- Baseline from a provisioned anchor's live `nordstern` schema.
- Migrations run **per anchor** at stack start (replace `initSchema()`); idempotent and
  safe on N existing anchors. Money tables (`deposit_releases`, `withdrawal_payouts`)
  are **additive-only, never dropped/recreated**. Preserve seeds as idempotent seeds.
- Canary one anchor before fleet-wide. Snapshot each anchor DB (M5) before applying.

### M4.3 — aggregator-service (`aggregator`) — lowest risk
- Baseline from live `aggregator` schema; migrate-on-start; idempotent initial-anchors seed.
- Single instance → simplest rollout; independent of the money path.

### Cross-cutting
- Each service gets a `db.yml`-style consistency/apply/drift check once it has a migration dir.
- M5 backups are the safety precondition for applying migrations to any DB with data.

**Recommended order:** ✅ platform/api → control-plane → business-server → aggregator.
