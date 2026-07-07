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

### M4.1 — control-plane (`controldb`) — next
- Introduce **node-pg-migrate** (fits raw `pg`; no new ORM).
- Baseline `0000` from the *live* schema (`pg_dump --schema-only`), capturing the
  `CREATE TABLE`s + all the accreted `ALTER ADD COLUMN`s as one non-destructive baseline.
- Replace `initDb()` inline DDL with a migrate-on-start step; delete the inline DDL.
- Add a CI drift/apply check (mirror db.yml).
- Deployment: control-plane is provisioning's backbone → migrate first.
- Rollback: baseline is additive; each later migration ships a `down`.

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
