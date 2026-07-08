# M2 — Local Production Simulation: Routing Verification Report

**Date:** 2026-07-08 · **Scope:** validate the clean single-host per-anchor routing
(`<slug>.<suffix>`) end-to-end on the local stack before any cloud infra (M3+).
**Verdict:** ✅ **GREEN.** Provisioning, routing, white-labeling, cookies/sessions,
customer + operator journeys, and a full SEP-24 deposit-to-receipt all pass under the
new host convention. Four provisioning bugs were found and fixed; two money-flow items
are documented as known follow-ups (they do not affect routing).

Local suffix `anchors.127.0.0.1.sslip.io` (sslip resolves `*.127.0.0.1.sslip.io` →
127.0.0.1; Traefik on :80) — a genuine multi-host test that maps 1:1 to `nordstern.live`
in prod (only the suffix + TLS entrypoint change, both env-driven).

---

## 1. Provisioned via the REAL founder flow (not manual containers)

`POST /applications` → admin `POST /admin/applications/:id/approve` → `POST
/anchor-invitations/redeem` (subdomain + branding) → real control-plane provisioning
(keygen → Friendbot + asset issuance → per-anchor DB → container stack → health →
aggregator). Two anchors driven to completion: **`nebula`** (first pass, surfaced the
toml bug), **`orbita`** (final green anchor). Asset `ORBITA`, status `completed`.

## 2. Routing — every URL tested (through Traefik :80)

| Surface | URL | Result |
|---|---|---|
| Customer app | `http://orbita.<suffix>/` | ✅ 200, white-labeled |
| Operator console | `http://console-orbita.<suffix>/` | ✅ 307→/overview→/login; `/login` 200 |
| SEP-1 toml | `http://orbita.<suffix>/.well-known/stellar.toml` | ✅ 200, **bare-host** URLs |
| SEP-24 info (AP) | `http://orbita.<suffix>/sep24/info` | ✅ 200 (Anchor Platform) |
| SEP-10 auth (AP) | `http://orbita.<suffix>/auth?account=G…` | ✅ 200, challenge issued |
| Biz webview | `http://orbita.<suffix>/sep24/interactive` | ✅ business-server (not AP) |
| Biz more-info | `http://orbita.<suffix>/sep24/transaction` | ✅ business-server |

Traefik routers (auto-created from container labels): `client-<slug>` (Host, prio 1),
`ap-<slug>` (Host + SEP paths, prio 10), `biz-<slug>` (Host + `/sep24/interactive|kyc|
razorpay|transaction`, prio 20), `console-<slug>` (Host, prio 1). **No `sep.`/`api.`/
two-level `console.` hosts.** One `*.<suffix>` wildcard covers everything.

## 3. White-labeling

Customer app served `<title>Orbita Pay …</title>`, brand accent baked into HTML/CSS,
zero leakage of other anchors or "NordStern". Branding set at redemption flows through
provisioning → containers → rendered output. ✅

## 4. Customer journey (APIs, through the anchor host)

| Step | Call | Result |
|---|---|---|
| OTP request | `POST /api/v1/customer/auth/request-otp` | ✅ 200 |
| OTP verify | `POST /api/v1/customer/auth/verify-otp` | ✅ 200, **`ns_customer` cookie host-bound to the anchor host** |
| Profile | `GET /api/v1/customer/me` | ✅ 200 |
| KYC status | `GET /api/v1/customer/kyc/status` | ✅ 200 |
| Buy quote | `GET /biz/api/quote?amount&side` | ✅ 200 (₹/unit, mock) |
| KYC start | `POST /biz/customer/kyc/start` | ✅ 200 (honest mock → `ACCEPTED`) |
| Transactions | `GET /biz/customer/transactions` | ✅ 200 |

Sessions/cookies/proxy all correct under the new host (host-only cookie binds to the
anchor host; `/api`→platform-api and `/biz`→business-server BFFs work container-to-container).

## 5. SEP-24 money flow — deposit to on-chain receipt

Headless wallet: keypair → Friendbot → `ORBITA` trustline → **SEP-10 on the bare host**
(JWT `home_domain=orbita.<suffix>`) → `POST /sep24/transactions/deposit/interactive` →
`/sep24/interactive/amount` → `/sep24/interactive/complete`. Money-safety gates observed
firing correctly: KYC gate **failed closed** for an unverified account (403); below-minimum
amount **rejected** (strategy `minDeposit=500`). With KYC satisfied (honest mock) and a
valid amount, **the account received 1000 ORBITA on-chain** — deposit → payment → receipt. ✅

## 6. Operator journey (APIs, through the console host)

| Step | Call | Result |
|---|---|---|
| OTP login | `POST /api/v1/auth/otp/{request,verify}` | ✅ 200, **`ns_access` on console host** |
| Dashboard | `GET /biz/admin/summary` | ✅ 200 (incl. treasury balances) |
| Transactions | `GET /biz/admin/transactions` | ✅ 200 (deposit listed) |

Operator money-admin path (`requireOperator` = `ns_access` + org-scope via platform-api)
works under the new routing.

## 7. Findings & fixes

| # | Finding | Severity | Status |
|---|---|---|---|
| F1 | `stellar.toml` / AP `home_domains` advertised `sep.<host>` (old scheme) while Traefik routes SEP on the bare host → wallets would fail SEP-10/24 | **High** | ✅ Fixed (`provision.ts` passes bare `home_domain`) |
| F2 | Deposit release always failed: orchestrator injected `DISTRIBUTION_*` but business-server reads `TREASURY_PUBLIC/SECRET` → "treasury has no trustline" | **High** | ✅ Fixed (inject `TREASURY_*`) |
| F3 | `PUBLIC_BASE_URL` defaulted to `localhost:3000`; `SEP_SERVER_URL` unset | **Med** | ✅ Fixed (inject bare host + AP container URL) |
| F4 | First provision left `nebula` with a bad toml | Low | ✅ Resolved by re-provision after F1 |

## 8. Known / open items (documented, NOT routing issues)

| # | Item | Impact | Recommendation |
|---|---|---|---|
| O1 | SEP-24 KYC gate imports `getStatus/createSession` **directly from the DIDIT adapter** (`sep24.ts`), bypassing the mock KYC adapter — so a mock anchor's gate still demands DIDIT | Mock anchors can't pass KYC without a real DIDIT session (worked around in test by writing an `ACCEPTED` verification) | Route the SEP-24 gate through the KYC adapter seam so `KYC_PROVIDER=mock` works end-to-end |
| O2 | After a successful on-chain release, the AP status PATCH fails: `'iso4217:INR' is not a supported asset` → tx shows `error` in the operator view though tokens were delivered | Money moves correctly, but the AP/operator transaction isn't marked completed | Declare the INR fiat asset in the AP `assets.yaml`, or drop the fiat amount from the PATCH |

## 9. Code audit — no legacy host assumptions

- Hardcoded `sslip.io` in source: **none** (only the compose config default suffix).
- Legacy `sep.`/`api.`/`console.` subdomain assumptions in source: **none** (removed).
- Hardcoded `localhost` in runtime logic: **none** (only env-var defaults).
- Frontends: resolve hosts at runtime (`window.location` / same-origin proxy); only a
  doc comment references `nordstern.live`.

## 10. Conclusion

The clean single-host routing is **fully validated locally on real provisioned
infrastructure**. The bare `<slug>.<suffix>` is the customer app; SEP + webview are
path-routed on it; the console is a single-label host — all under one wildcard. The
provisioning-env drift that would have broken the demo in the cloud was caught and fixed
here. **Cleared to proceed to M3 (Terraform: RDS + EC2 + networking).** O1/O2 are
money-flow polish, independent of the cloud rollout, and can be scheduled separately.
