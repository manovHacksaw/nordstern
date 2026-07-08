# R6 M3 — Money-Flow Tests (confidence over coverage)

> Goal: *"If someone accidentally changes the payment logic tomorrow, CI will fail
> before it reaches production."* Grounded in the real implementation, not mocks of it.

## Phase 1 — Money-flow map & criticality

| Flow | Where | Irreversible? | Guard mechanism | Criticality |
|---|---|:--:|---|:--:|
| **Deposit release** (mint/send USDC) | `business-server/releases.ts` | **Yes** (on-chain send) | atomic `deposit_releases` claim (INSERT…ON CONFLICT…WHERE status='failed') + on-chain adopt + reconciler | **Critical** |
| **Withdrawal payout** (INR disburse) | `business-server/poller.ts` | **Yes** (fiat payout) | atomic `withdrawal_payouts` claim + payout-before-complete ordering | **Critical** |
| **SecretStore** (PSP/banking creds) | `platform/api/lib/secrets/*` | **Yes** (leak/rotation) | one secret per anchor, provider-namespaced keys, refs-only in DB | **Critical** |
| **Provisioning** (per-anchor stack) | `platform/api` + `control-plane` orchestrator | Partial (orphan stacks) | `provisioner.resume` idempotent re-provision, stable slug/secret path | **High** |
| **Treasury reserve check** | `stellar.assertTreasuryReserve` | guards the send | pre-send balance assertion | **High** |
| **Reconciliation** (crash recovery) | `releases.reconcile*` | must not double-send | STALE window ≫ ledger close; adopt-if-on-chain | **Critical** |
| **Aggregator routing / quotes / health** | `aggregator-service` | No (advisory) | routing policy + health metrics | Medium |
| **Strategy engine** (limits, e-stop, fees) | `business-server/sep24` + strategy_config | Config-gated | limits + emergency stop | High |
| **KYC decision** (DIDIT webhook) | `business-server/webhooks.ts` | Gates deposits | atomic dedupe + decision | High |
| **Auth / invitation redeem** | `platform/api/auth` + `anchorInvitation` | Access control | role/tenant scope, host-only cookie | High |
| **Audit logs** | per service | Append-only | insert-only | Low |

## Phase 2 — Test strategy (Critical flows)

For each critical flow we test the scenarios that *lose money or corrupt state* if
they regress — and only those. Why each exists:

| Scenario | Why it exists (the failure it prevents) |
|---|---|
| Happy path | Baseline: the money moves once, state reaches terminal. |
| Duplicate request (sequential) | A retried webhook / double-click must not double-pay. |
| Duplicate request (concurrent race) | Two workers/ticks hitting the same tx must not both pay — proves the *atomic* claim, not just app-level checks. |
| Retry after completion | A retry of a settled tx is a no-op, never a second transfer. |
| Idempotent send / adopt | After a crash, a transfer already on-chain is *adopted*, never re-sent. |
| Restart / crash recovery | A row left mid-flight (`submitting`/`submitted`) resolves without a second money move. |
| Partial failure → recovery | A failed send/payout is safely re-driven and eventually completes **once**. |
| Reserve / precondition guard | Insufficient treasury blocks the send (no over-release). |
| Provider isolation (secrets) | Deleting one PSP's creds never touches another's. |
| Masking / no plaintext | Describe/refs never expose secret values. |

## Phase 3 — Test architecture

- **Vitest** as the runner (ESM-native, fast).
- **Testcontainers** for real infra — no fakes for the part that guards money:
  - **Postgres 15** for deposit/withdrawal (real `ON CONFLICT`, real unique constraints, real concurrency).
  - **LocalStack (Secrets Manager)** for SecretStore — the *same* AWS SDK path as prod, endpoint swapped.
- **Mock boundary = only the truly external systems**: the Stellar chain (`stellar.js`)
  and Anchor Platform (`platform.js`), and the payout PSP (`adapters`). Everything that
  enforces the money invariant (the SQL claim, the ordering, the reconciler) runs for real.
- **Observable assertions only**: we count *how many times money actually moved*
  (`sendUsdc` / `payout.disburse` call counts) and check durable row state — never
  internals, no snapshots.
- Test files are excluded from `tsconfig` so `build`/`typecheck` (M2 gates) are unaffected.

## Phase 4 — Implemented tests (critical-path matrix)

### `business-server` — deposit release (9 tests, real Postgres)
| Test | Proves |
|---|---|
| happy path | sends once, completes |
| duplicate (sequential) | second call → `already`, **sendUsdc called once** |
| duplicate (concurrent race) | atomic claim holds, **sendUsdc called once** |
| retry after completion | no-op send |
| idempotent send | adopts on-chain transfer, **does not resend** |
| restart recovery (`submitted` row) | finishes without resending |
| treasury reserve guard | blocks send, marks failed |
| **failure recovery** (injected send failure) | reconciler re-drives → completes; money moves once |
| reconciler adopt | stuck row + on-chain transfer → completed, **never double-sent** |

### `business-server` — withdrawal payout (5 tests, real Postgres)
| Test | Proves |
|---|---|
| happy path | disburses once, completes |
| duplicate (re-listed) | **disburse called once** |
| duplicate (concurrent race) | **disburse called once** |
| idempotent (completed) | self-heals AP, **never re-pays** |
| **failure recovery** (injected payout failure) | reclaims + retries → completes once |

### `platform/api` — SecretStore (7 tests, real LocalStack)
| Test | Proves |
|---|---|
| create (put→get) | round-trips; ref is a pointer with no values |
| update | re-put replaces the provider slice |
| rotate | wholesale credential replacement |
| delete | provider keys removed |
| **provider isolation** | deleting razorpay leaves cashfree intact |
| **masking** | describe returns key names, never values |
| **no plaintext persistence** | the persisted ref carries no credential values |

**21 tests total.** Local run: business-server ~11s (incl. one Postgres container),
platform/api ~6s (incl. one LocalStack container).

## Phase 5 — CI integration
New independent **`tests.yml`** (does not touch `ci.yml`): matrix over the two
workspaces, reuses the M2 composite `setup` action, runs on **every PR** (no path
filter — any change re-proves the invariants). `tests-required` aggregation is a
blocking, deadlock-safe required check (added to the branch-protection ruleset).
`TESTCONTAINERS_RYUK_DISABLED` set for GitHub-runner reliability.

## Verification (the "Demonstrate" list)
- **Duplicate requests cannot duplicate money** — deposit + withdrawal duplicate/concurrent tests (call count == 1). ✅
- **Retries remain safe** — retry-after-completion + idempotent-send. ✅
- **Restarts remain safe** — `submitted`-row recovery + reconciler adopt. ✅
- **SecretStore never exposes plaintext** — masking + no-plaintext-ref tests. ✅
- **Failure injected → recovery proven** — deposit send failure re-drive + withdrawal payout failure retry. ✅
- **Provisioning idempotent / Aggregator health** — see *Deferred* below.

## Deferred (next M3 increment — mapped, not yet implemented)
These are High/Medium (not the core "payment logic") and are staged next, reusing
the same harness pattern:
- **Provisioning idempotency** (`provisioner.resume`, duplicate redeem, branding/secret injection) — needs a control-plane harness (dockerode-adjacent).
- **Aggregator** routing under changing health / quote expiration / unavailable anchor.
- **Strategy engine** limits / emergency stop / maintenance mode / fee math.
- **Auth** invitation redemption / authorization / cookie scope (OTP-ready) — pairs with R4.

## Success criterion — met for payment logic
The deposit, withdrawal, and SecretStore suites run on every PR against real infra.
**A change that breaks at-most-once payment or secret handling now fails CI before merge.**
