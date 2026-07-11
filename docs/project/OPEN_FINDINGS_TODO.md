# NordStern — Open Findings & TODO

> Prioritized backlog from the 2026-07-09 manual test run (see
> [`TEST_RUN_SUMMARY.md`](./TEST_RUN_SUMMARY.md)). Grouped by priority. Each item notes
> the file(s) to touch. **P0** = functional gap / correctness; **P1** = product-boundary
> or trust issue; **P2** = polish / future.
>
> **Dev iteration:** stack runs via `infrastructure/docker/platform.yml`. Admin console
> `admin.localhost:4002`, founder `register.localhost:4001`. For UI work use dev mode
> (`npm run -w @nordstern/<app> dev`, hot reload on :3000, proxies `/api` → :4000).

---

## ✅ Fixed in the follow-up pass (2026-07-09, commits `22f6ad3`…`e05a216`)

- **#5 Founder overview = real "my anchors" portfolio** (was mock operator dashboard). New
  platform-api `GET /anchors`; sidebar trimmed to founder concerns. (`22f6ad3`)
- **#15 Asset label** — operator console shows the real `ASSET_CODE` (DIDITTEST), not "USDC". (`25bff47`)
- **#10 Live amount validation** — Buy/Sell validate min/max as the user types (quote returns
  limits); no more late full-screen "Operational Limits Exceeded". (`959ec4b`)
- **#7 Explain the wallet confirmation** + **#9 (secondary)** prepare the user before the
  payment handoff. (`33f2736`)
- **Admin approve modal → email-first**; dropped "Open redeem page" (persona-bleed); link is a
  dev/ops fallback. (`e05a216`)
- **#6 KYC poll-path propagation** — platform mode now propagates a poll-resolved DIDIT decision
  to the central customer profile (no more "Finishing verification" hang when the webhook can't
  reach us). (`e05a216`)
- Earlier this session: **#13 off-ramp hands-free** (`ec658c5`), **B5 reserved slugs** (`39a3858`).

**Remaining open: only the "grandfathered mock-era KYC" DECISION (below) + P2 polish.**

## ✅ Fixed during the test run (committed `f541071`)

- **Universal DIDIT KYC** — factory defaults every anchor to real DIDIT; mock is an
  explicit dev opt-in. (`control-plane/provision.ts`, `orchestrator.ts`, compose, `.env.base`)
- **#9 KYC reuse bridge** — verify-once across anchors + money path.
  (`platform/api/.../internal.routes.ts`, `business-server/adapters/kyc/didit.ts`,
  `anchor-client` Buy/Sell wallet-link)
- **#11 Buy processing-poll** — customer-session endpoint, no infinite spinner.
  (`anchor-client/app/(app)/buy|sell/page.tsx`, `lib/anchor.ts`)
- **#12 Native off-ramp "click to send" + realistic payout.**
  (`business-server/customerApi.ts`, `adapters/payout/mock.ts`, `anchor-client` sell)
- **#14 Operator Transactions NaN** — flatten AP `{amount,asset}`. (`business-server/admin.ts`)
- **#13 Off-ramp hands-free** (`ec658c5`) — poller self-detects the on-chain transfer via
  Horizon (memo+amount+asset) and advances `pending_user_transfer_start → pending_anchor`;
  no AP-events dependency. Verified live hands-free. Also fixed en route: sell receipt INR
  amount (was showing asset count with ₹), and a **5-min session reaper** (abandoned
  sessions → expired, leave "In Progress"). (`poller.ts`, `stellar.ts`, `customerApi.ts`)
- **B5 Reserved slugs** (`39a3858`) — reject `admin/register/api/console/…` as anchor slugs
  at both platform-api redeem + control-plane. (`platform/api/lib/slug.ts`, `control-plane/provision.ts`)

---

## P0 — functional gaps (do first)

### #6 · DIDIT KYC decision propagates to central profile ONLY via webhook
`propagateKycToPlatform` is called only from the DIDIT webhook (+ the mock shortcut). The
poll fallback (`getStatus`) updates the anchor-local `kyc_verifications` but NOT the
central `platformdb.customers.kyc_status`, which the app polls — so with no public webhook
(local dev) the app hangs on "Finishing verification…" even though DIDIT approved. Works in
prod (public webhook) but fragile (a missed webhook = KYC never propagates).
**Fix:** propagate to central from the poll path too when `getStatus` resolves
approved/declined. **File:** `anchor-template/business-server/src/adapters/kyc/didit.ts`.

---

## P1 — product boundaries & trust

### #5 · Founder overview is a mislocated operator dashboard + MOCK DATA
`platform/founder-console/app/(app)/overview` renders a single-anchor operator dashboard
with **synthetic mock data** (Acme Corp, $45,231.89, 573 nodes, "Chart placeholder").
Wrong place (that belongs to the per-anchor operator console) **and** violates no-mock-data.
**Fix:** make founder overview a real **"my anchors" portfolio** (launched anchors +
status + links to each console/customer app), org-level. Audit the founder sidebar too
(Transactions/Developers/treasury are operator concerns; founder keeps Anchors/Team/Settings).
**Login routing (DECIDED):** operator login at `console.<slug>…` → that anchor's console
overview; founder login at `register.*` → the portfolio (never a single-anchor dashboard).

### #9 (secondary) · Buy "Pay" still opens the raw SEP-24 webview
The KYC double-verify is fixed, but Buy→Pay still hands off to the server-rendered SEP-24
webview (raw Transaction id, "SEP-24", different theme) — the surface the native app was
meant to replace. **Fix:** keep Buy fully in-app (mirror the native off-ramp pattern) or,
at minimum, prepare/tell the user before the handoff.

### #10 · Buy/Sell amount validation only fires AFTER handoff
Min/max bounds are enforced late (in the webview) → jarring full-screen "Operational Limits
Exceeded". **Fix:** fetch the anchor's min/max and validate live on the Buy/Sell page
(disable Continue + inline "Min…/Max…" as the user types); keep the server check as backstop.
**Files:** `anchor-client` Buy/Sell pages.

### #15 · Asset unit hardcoded "USDC" in some components
Inconsistent: some components use the real `ASSET_CODE` (operator sidebar, Settings,
Customers, Pricing), but Treasury / Overview / Reports / the customer app hardcode "USDC"
though the anchor issues **DIDITTEST**. Values are correct — only the label is wrong.
**Fix:** thread `ASSET_CODE` into the remaining hardcoded components. Ties into the
asset-model decision (single INR↔USDC vs per-anchor mint — [[nordstern-usdc-anchor-pivot]]).

### #7 · Explain WHY the customer is signing
The Buy/Sell "secure confirmation" (a SEP-10 signature) is a scary blind signature.
**Fix:** plain-language copy — what they authorize and why (proves wallet control; does
NOT move money out). Never expose "SEP-10"/"sign a transaction".
**File:** `anchor-client/lib/settlement.ts` + Buy/Sell copy.

### Admin approve modal — email-first (from #2)
Backend already emails the founder the redeem link on approve. Drop the "Open redeem page"
button (persona-bleed); confirm "Invitation emailed to X"; surface the raw link only as a
dev/ops fallback. Also **align the founder URL**: the email uses `CONSOLE_URL`
(localhost:4001) but the admin modal uses `NEXT_PUBLIC_FOUNDER_URL` (register.localhost) —
make consistent; prod = `https://register.nordstern.live`. **File:** `platform/admin-console/app/page.tsx`.

### Grandfathered mock-era KYC approvals
Emails approved under the old mock-KYC era still count as "verified" and bypass real DIDIT.
**Decide:** invalidate / require re-verification, or accept. (Surfaced by the KYC-reuse work.)

---

## P2 — features & polish

### #8 · Gasless / trustline up-front (big UX win)
Customers needing XLM for fees + a trustline to receive the asset is the #1 drop-off
(confirmed: on-ramp blocked with "Add a DIDITTEST trustline"). **Fix direction (DECIDED):**
establish the trustline on **first wallet connect/login**, not mid-purchase — ideally
**sponsored (CAP-33)** so an empty wallet receives the asset with no XLM/trustline step;
use **fee-bump** so the customer never pays network fees. Same hook as the wallet-linking we
added on connect. Decide the sponsor-account model + who funds it. ([[nordstern-settlement-model]])

### Redeem / activation page (#3)
Improve `platform/founder-console/app/(auth)/redeem/page.tsx`: activation wizard
(slug/branding/PSP creds → real provisioning status → "anchor is live" URLs), plus:
- **Logo upload** instead of a URL (needs upload endpoint + object storage; LocalStack S3
  in dev → S3 in prod, mirroring SecretStore parity).
- **OTP-verify-on-accept** — verify the invited email before activating (reuse operator OTP);
  proves the person controls the inbox, not just holds the link.

### UI polish
- **#1 Understand Traefik** — plain-English deep-dive (host routing, labels, priorities, TLS).
- **#2 Admin console UI** — polish `platform/admin-console` (applications queue). Shared
  primitives in `platform/shared-ui` (changing them affects founder-console).
- **#4 Founder login page UI** — `platform/founder-console/app/(auth)/login/page.tsx`.

---

## Not in scope (separate mainnet gate)

Real fiat off-ramp payout (live Cashfree), mainnet/real money, live FX, production TLS /
public domain / Kubernetes. Authored but un-applied; gated per AGENTS.md §7.
