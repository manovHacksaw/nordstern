# NordStern Customer App — UAT / Manual Test Checklist

**Purpose:** exhaustive manual acceptance test for the customer-facing app (`<anchor>.nordstern.live`),
run before every release/demo. Execute by hand; record Actual / Status / Notes.

**Status legend:** ✅ Pass · ❌ Fail · ⚠️ Partial · ⛔ Blocked · N/A
**Priority:** Critical (money/auth/security/isolation) · High · Medium · Low

---

## 0. Test environment & preconditions (read first)

- [ ] A **freshly provisioned anchor** is `active` (its own subdomain, white-label brand).
- [ ] A **real email inbox** you control (OTP delivery). If mailer runs in console mode, the OTP appears in the platform-api logs, not an inbox — note which.
- [ ] A **Stellar wallet extension** (e.g. Freighter) installed, with a **funded testnet account** that has a trustline for the anchor's asset — required for Buy/Sell settlement (self-custodial).
- [ ] The anchor's **DIDIT credentials configured** if you want to exercise real KYC. If the anchor runs **mock KYC**, KYC-start is *expected* to return an honest error — that is a **Pass**, not a bug.
- [ ] A **second browser / private window** and a **second customer email** for isolation tests.
- [ ] Mobile device or DevTools device emulation for responsive tests.

**Known honest limitations (a correct result here is a graceful/honest failure, not a crash or fake success):**
- KYC needs real DIDIT creds; on a mock-KYC anchor, "Start verification" → honest error.
- Buy/Sell require the customer's wallet to sign a "secure confirmation" (self-custodial).
- The fiat-payment step opens the anchor's hosted payment page (interactive flow), wrapped by native screens.
- History only shows transactions for wallets the customer has **linked**, on **this anchor only**.

---

## 1. Authentication (email + OTP, no passwords)

| ID | Pri | Preconditions | Steps | Expected Result | Actual | Status | Notes |
|----|-----|---------------|-------|-----------------|--------|--------|-------|
| AUTH-01 | Critical | Logged out | Open app → land on sign-in. Enter valid email → Continue | Moves to OTP entry; "code sent to <email>"; no password field anywhere | | | |
| AUTH-02 | Critical | AUTH-01 done | Retrieve code, enter it → Verify | Signs in; lands on Home; new account created if first time | | | |
| AUTH-03 | High | On OTP step | Enter a **wrong** 6-digit code | Clear "Incorrect code" error; stays on OTP step; not signed in | | | |
| AUTH-04 | High | Request OTP, wait >10 min | Enter the (now expired) code | "Code expired… request a new one"; not signed in | | | |
| AUTH-05 | Medium | On OTP step | Tap "Use a different email" | Returns to email step; code cleared | | | |
| AUTH-06 | High | On OTP step | Enter wrong code 5+ times | After the cap, "Too many attempts — request a new code" | | | |
| AUTH-07 | Medium | — | Enter a malformed email (e.g. `abc`, `a@b`) → Continue | Validation error; no OTP sent | | | |
| AUTH-08 | Critical | Signed in | Go to Profile → Sign out | Returns to sign-in; session cleared | | | |
| AUTH-09 | Critical | Signed in | Refresh the page | Stays signed in; lands on same/home screen (no re-login) | | | |
| AUTH-10 | High | Signed in | Open the app in a **second tab** | Second tab is already signed in (shared session) | | | |
| AUTH-11 | High | Signed in, one tab | Sign out in tab A, then use tab B | Tab B, on next navigation/action, is treated as signed out (401 → sign-in) | | | |
| AUTH-12 | High | Signed in | Close browser completely, reopen, go to app | Still signed in (session cookie persists, ~30d) | | | |
| AUTH-13 | Medium | Signed in | Sign in again with the **same email** (new tab, fresh OTP) | Same account; no duplicate account created | | | |
| AUTH-14 | Low | — | Request OTP twice quickly for same email | Second request also succeeds (latest code valid); no error leak about account existence | | | |

---

## 2. Home

| ID | Pri | Preconditions | Steps | Expected Result | Actual | Status | Notes |
|----|-----|---------------|-------|-----------------|--------|--------|-------|
| HOME-01 | High | First login, unverified | Land on Home | Greeting ("Hi, there"); KYC card prompts to verify; Buy/Sell tiles; empty "Recent activity" | | | |
| HOME-02 | Medium | Returning, name set | Land on Home | Greeting uses first name | | | |
| HOME-03 | High | Unverified | Tap the KYC status card | Routes to /verify | | | |
| HOME-04 | High | Verified | View KYC card | Shows "Identity verified" (success); card routes to Profile | | | |
| HOME-05 | Critical | Signed in | Tap Buy tile, then Sell tile | Navigate to /buy and /sell respectively | | | |
| HOME-06 | Medium | Signed in | Observe empty activity | Honest empty state with brand name; no fake transactions | | | |
| HOME-07 | Medium | Signed in | Tap "View all" on activity | Routes to /transactions (Activity) | | | |
| HOME-08 | Medium | Slow network (throttle) | Load Home | Loading state (not a blank/broken screen); resolves to content | | | |
| HOME-09 | Medium | Signed in | Use bottom tab bar: Home/Buy/Sell/Activity/Profile | Each tab highlights active; navigates correctly | | | |
| HOME-10 | Medium | Signed in | Tap the top-right support icon | Routes to /support | | | |

---

## 3. Profile & Wallet linking

| ID | Pri | Preconditions | Steps | Expected Result | Actual | Status | Notes |
|----|-----|---------------|-------|-----------------|--------|--------|-------|
| PROF-01 | High | Signed in | Open Profile | Shows email (read-only), name field, KYC status, linked wallets, sign out | | | |
| PROF-02 | Medium | Profile open | Edit name → save (check) | Name persists; shows updated value | | | |
| PROF-03 | Medium | PROF-02 | Refresh page → reopen Profile | Updated name still shown (persisted server-side) | | | |
| PROF-04 | Low | Profile open | Try to edit the email | Email is not editable | | | |
| PROF-05 | High | Profile open | Link a valid wallet address (G…56 chars) + optional label → Link | Wallet appears in the list (masked address) | | | |
| PROF-06 | High | Profile open | Link an **invalid** address ("not-a-wallet", too short) | Error "doesn't look like a valid wallet address"; not linked | | | |
| PROF-07 | Medium | A wallet already linked | Link the **same** address again | Idempotent — no duplicate row (or clean "already linked"); list unchanged | | | |
| PROF-08 | High | ≥1 wallet linked | Tap unlink (trash) → confirm | Wallet removed from the list | | | |
| PROF-09 | Medium | Wallets changed | Refresh page | Wallet list reflects the current state (persisted) | | | |
| PROF-10 | Medium | 0 wallets | View wallets section | Honest "No wallets linked yet"; guidance text present | | | |
| PROF-11 | High | Unverified | View KYC row | Shows "Verify" button → /verify | | | |
| PROF-12 | High | Verified | View KYC row | Shows "Verified" badge; no verify button | | | |

---

## 4. KYC (DIDIT — client never self-declares)

| ID | Pri | Preconditions | Steps | Expected Result | Actual | Status | Notes |
|----|-----|---------------|-------|-----------------|--------|--------|-------|
| KYC-01 | Critical | Unverified, DIDIT configured | /verify → Start verification | Opens hosted DIDIT flow (new tab); app shows "Finishing verification…" | | | |
| KYC-02 | Critical | Unverified, **mock-KYC** anchor | /verify → Start verification | **Honest error** ("temporarily unavailable / try again") — NOT a crash, NOT a fake "verified" | | | |
| KYC-03 | Critical | KYC-01, complete DIDIT successfully | Finish DIDIT, return to app | App auto-updates to "You're verified" (polling central status); Buy/Sell now unlocked | | | |
| KYC-04 | High | KYC-01, DIDIT declined/failed | Fail the DIDIT check | App shows "We couldn't verify you"; retry + contact support offered | | | |
| KYC-05 | High | Verification in review | Return to app | Shows "Verification in review" (pending); updates when resolved | | | |
| KYC-06 | High | Verified already | Open /verify | Shows "You're verified"; "Start buying" CTA; no re-verify needed | | | |
| KYC-07 | Medium | On DIDIT hosted flow | Cancel / close the DIDIT tab | App stays on "Finishing…"; status remains unverified; can retry | | | |
| KYC-08 | High | Declined earlier | Tap "Try again" | Returns to intro; can start a new session | | | |
| KYC-09 | Medium | Mid-verification | Refresh the app tab | App re-reads status; shows correct state (processing/verified/unverified) | | | |
| KYC-10 | Critical | Any | Attempt to mark yourself verified from the client (see Security SEC-08) | Impossible — status only changes via server-to-server after DIDIT | | | |

---

## 5. Buy (self-custodial settlement)

| ID | Pri | Preconditions | Steps | Expected Result | Actual | Status | Notes |
|----|-----|---------------|-------|-----------------|--------|--------|-------|
| BUY-01 | High | Unverified | Open Buy | Verify-first banner shown; "Verify" routes to /verify | | | |
| BUY-02 | Critical | Verified | Enter a valid amount | Live "You pay ₹…" quote appears; rate line shown | | | |
| BUY-03 | High | Buy amount screen | Type an **invalid** amount (letters, `0`, empty) | Non-numeric blocked; Continue disabled until a valid positive amount | | | |
| BUY-04 | High | Buy amount screen | Enter **decimals** (e.g. 12.5) | Quote updates correctly; accepted | | | |
| BUY-05 | High | Buy amount screen | Enter below the anchor's **minimum** | Blocked at the payment step with a clear "limit" message (min enforced server-side) | | | |
| BUY-06 | High | Buy amount screen | Enter above the anchor's **maximum** | Blocked with a clear "operational limits" message | | | |
| BUY-07 | Medium | Typing amount | Change amount several times | Quote debounces/refreshes to match the latest amount (no stale quote) | | | |
| BUY-08 | Medium | Amount → Continue | On review, tap Back | Returns to amount; entered value retained | | | |
| BUY-09 | Critical | Review screen, no wallet | Tap "Confirm securely" | Prompts to connect a wallet; if none available, honest message ("need a connected wallet") | | | |
| BUY-10 | Critical | Review, wallet available | Tap "Confirm securely" | Wallet asks to sign (the "secure confirmation"); on approve, proceeds to payment | | | |
| BUY-11 | High | Confirmed | Payment screen appears | "Complete your payment / Pay ₹…" with UPI handoff | | | |
| BUY-12 | Critical | Payment screen | Complete a **real UPI payment** (if Razorpay configured) | Funds verified; app moves to Processing → "Money added"; receipt shown | | | |
| BUY-13 | High | Payment screen | Start payment then **cancel/close** the payment window | App can still poll; shows awaiting/processing; no funds released without verified payment | | | |
| BUY-14 | High | Processing | Wait through processing | Customer-language steps advance (Payment → Received → Processing → Completing → Done); no SEP/Stellar terms | | | |
| BUY-15 | High | Completed | View receipt | Amount, you-paid, reference, completed time, Completed badge | | | |
| BUY-16 | Medium | Receipt | Expand "Advanced details" | Technical ids (tx/chain/wallet) shown only here; hidden by default | | | |
| BUY-17 | High | Mid-flow (amount/confirm/processing) | Refresh the page | No crash; flow resets gracefully OR resumes; no duplicate charge, no fake success | | | |
| BUY-18 | Medium | On any Buy step | Browser Back button | Lands sensibly (previous screen or Home); no broken state | | | |
| BUY-19 | High | Payment initiated | Leave it idle a long time (timeout) | Eventually shows a non-terminal/awaiting or a clear timeout; never a fake "completed" | | | |
| BUY-20 | Medium | Buy in one tab | Open a second tab and start another Buy | Each tab independent; no cross-contamination of amounts/sessions | | | |
| BUY-21 | Critical | Verified but wallet has no asset trustline | Confirm and pay | Fails safely BEFORE charging (trustline required) with a fixable message; no money lost | | | |

---

## 6. Sell (mirror of Buy)

| ID | Pri | Preconditions | Steps | Expected Result | Actual | Status | Notes |
|----|-----|---------------|-------|-----------------|--------|--------|-------|
| SELL-01 | High | Unverified | Open Sell | Verify-first banner; routes to /verify | | | |
| SELL-02 | Critical | Verified | Enter valid amount | "You receive ₹…" quote appears | | | |
| SELL-03 | High | Sell amount | Invalid amount (letters/0/empty) | Blocked; Continue disabled | | | |
| SELL-04 | High | Sell amount | Decimals | Accepted; quote correct | | | |
| SELL-05 | Medium | Sell amount | Rapidly change amount | Quote refreshes to latest | | | |
| SELL-06 | High | Review | Tap Back | Returns to amount; value retained | | | |
| SELL-07 | Critical | Review, wallet available | Confirm securely | Wallet signs; proceeds to transfer step | | | |
| SELL-08 | High | Transfer step | Complete the transfer (send asset) | App polls → "Sending to your bank" → "Cash sent"; receipt shown | | | |
| SELL-09 | High | Transfer step | Cancel / don't send | Stays awaiting; no payout without a received transfer | | | |
| SELL-10 | High | Completed | View receipt | Sold amount, you-receive, reference, Completed badge | | | |
| SELL-11 | High | Mid-flow | Refresh page | No crash; graceful; no duplicate payout | | | |
| SELL-12 | Medium | Any step | Browser back | Sensible navigation; no broken state | | | |

---

## 7. Transaction history (per-anchor, customer-scoped)

| ID | Pri | Preconditions | Steps | Expected Result | Actual | Status | Notes |
|----|-----|---------------|-------|-----------------|--------|--------|-------|
| HIST-01 | High | New customer, no tx | Open Activity | Honest empty state; no fabricated rows | | | |
| HIST-02 | Critical | Customer has 1 completed tx (buy/sell) | Open Activity | Exactly that 1 transaction appears with correct amount/status | | | |
| HIST-03 | High | Customer has several tx | Open Activity | All their tx listed; **newest first** | | | |
| HIST-04 | Medium | Multiple tx | Use filters (All / Buy / Sell / In progress) | List filters correctly; counts make sense | | | |
| HIST-05 | High | ≥1 tx | Tap a transaction | Details screen: amount, you-paid/received, reference, times, status | | | |
| HIST-06 | Medium | Details open | Expand "Advanced details" | Technical ids visible only here | | | |
| HIST-07 | Medium | Details of a pending tx | Wait on the screen | Auto-refreshes status while non-terminal | | | |
| HIST-08 | Medium | Activity list | Tap refresh | Reloads current data; no error | | | |
| HIST-09 | Critical | Customer B (different linked wallet) | Open Activity | Does **NOT** see Customer A's transactions (isolation) | | | |
| HIST-10 | High | Customer with a tx on a wallet they later **unlinked** | Open Activity | Only currently-linked wallets' tx are shown (expected behaviour — note if surprising) | | | |
| HIST-11 | High | Tx belongs to another customer | Open its detail URL directly (see SEC-04) | 404 / not found — never another customer's data | | | |

---

## 8. Support

| ID | Pri | Preconditions | Steps | Expected Result | Actual | Status | Notes |
|----|-----|---------------|-------|-----------------|--------|--------|-------|
| SUP-01 | Medium | Signed in | Open Support | Shows the anchor's support email + FAQ | | | |
| SUP-02 | Medium | Support open | Tap "Email …" | Opens mail client to the **anchor's** support address (from branding), not NordStern | | | |
| SUP-03 | Low | Support open | Expand/collapse FAQ items | Accordion works; content readable | | | |
| SUP-04 | Low | On a transaction detail | Tap "Get help with this" | Routes to Support; reference discoverable | | | |

---

## 9. White-label branding

| ID | Pri | Preconditions | Steps | Expected Result | Actual | Status | Notes |
|----|-----|---------------|-------|-----------------|--------|--------|-------|
| BRAND-01 | High | Anchor with brand name/accent/logo set | Open the app | Anchor's name, accent colour, and logo appear throughout; NO "NordStern" branding to the customer | | | |
| BRAND-02 | Medium | — | Check browser tab title | Title is white-labeled to the anchor | | | |
| BRAND-03 | High | Two different anchors provisioned | Open both apps | Each shows its own distinct brand (name/colour/logo) — one image, N brands | | | |
| BRAND-04 | Medium | Anchor with support email set | Support page | Uses the anchor's support email | | | |
| BRAND-05 | Low | Anchor with no logo | Open app | Falls back to a branded monogram (never blank, never NordStern) | | | |

---

## 10. Mobile / Responsive

| ID | Pri | Preconditions | Steps | Expected Result | Actual | Status | Notes |
|----|-----|---------------|-------|-----------------|--------|--------|-------|
| MOB-01 | High | Phone / 375px | Load app | Mobile-first layout; no horizontal scroll; bottom tab bar reachable | | | |
| MOB-02 | Medium | Phone | Tap targets (buttons, tabs, wallet unlink) | All comfortably tappable (≥40px) | | | |
| MOB-03 | Medium | Phone | Amount entry keyboard | Numeric keypad appears for amount fields | | | |
| MOB-04 | Medium | Phone | Rotate portrait ↔ landscape | Layout reflows; no clipped/overlapping content | | | |
| MOB-05 | Low | Tablet / 768px | Load app | Centered, readable; not stretched full width awkwardly | | | |
| MOB-06 | Medium | Desktop wide | Load app | Content constrained to a sensible max width; looks intentional | | | |
| MOB-07 | Medium | Phone | Long content (History, FAQ) | Scrolls smoothly; bottom nav stays fixed/reachable | | | |

---

## 11. Security (manual)

| ID | Pri | Preconditions | Steps | Expected Result | Actual | Status | Notes |
|----|-----|---------------|-------|-----------------|--------|--------|-------|
| SEC-01 | Critical | Just signed out | Press Back / open /home, /buy, /profile directly | Redirected to sign-in; no protected content shown | | | |
| SEC-02 | Critical | Signed in as A | Copy a transaction detail URL; open in a session signed in as **B** | 404 / not found — B cannot see A's transaction | | | |
| SEC-03 | Critical | Signed out | Directly call `/biz/customer/transactions` (no session) | 401 Unauthorized | | | |
| SEC-04 | Critical | Signed in as B | Directly request A's `/biz/customer/transactions/<A-tx-id>` | 404 — isolation holds via linked-wallet scoping | | | |
| SEC-05 | High | Signed in, second browser | Sign in as a different customer in browser 2 | Two independent sessions; no data bleed between them | | | |
| SEC-06 | High | Session cookie present | Inspect the `ns_customer` cookie | httpOnly + secure (in prod); not readable by page JS | | | |
| SEC-07 | High | Signed in | Tamper the session cookie value; reload/act | Treated as unauthenticated (signature check fails) → sign-in / 401 | | | |
| SEC-08 | Critical | Signed in | Attempt to POST a "verified" status from the client (devtools) to any customer/KYC route | Rejected — no client route sets KYC; only service-secret backend can | | | |
| SEC-09 | High | Long-lived session | Leave idle past token expiry (or force expiry) | Next protected action → sign-in; no stale access | | | |
| SEC-10 | High | Signed in as A | Try to link a wallet already linked to B / act on B's data | No cross-account effect; scoped to A only | | | |
| SEC-11 | Medium | — | Enter an amount that would exceed limits via the API directly | Server-side limits enforced (not just UI) | | | |
| SEC-12 | Medium | — | Confirm no Stellar secret keys, XDR, or raw tokens are exposed in the UI or network responses to the customer | None exposed; only opaque references | | | |

---

## 12. Edge cases (normal users trigger these)

| ID | Pri | Feature | Steps | Expected Result | Actual | Status | Notes |
|----|-----|---------|-------|-----------------|--------|--------|-------|
| EDGE-01 | High | Buy | **Double-click** "Confirm securely" / "Pay" rapidly | Single action; no double charge / double tx | | | |
| EDGE-02 | High | Buy | **Refresh during payment** | No duplicate charge; state resolves honestly | | | |
| EDGE-03 | Medium | Nav | **Back button** repeatedly through a flow | Never a broken/blank screen | | | |
| EDGE-04 | High | Any | **Network disconnect** mid-action, then reconnect | Clear error; retry works; no corrupt state | | | |
| EDGE-05 | Medium | Mobile | **Rotate** device during a flow | Layout survives; input retained | | | |
| EDGE-06 | Medium | Auth | **OTP resend spam** (request many codes) | Rate-limited after ~20/15min; no crash; latest code works | | | |
| EDGE-07 | High | Buy/Sell | **Duplicate submit** (Enter key + click) | One submission only | | | |
| EDGE-08 | Medium | Any | **Close browser** mid-flow, reopen | Session persists; incomplete flow not falsely "completed" | | | |
| EDGE-09 | Medium | Auth | Paste code with spaces / extra chars | Trimmed and accepted (or clear error) | | | |
| EDGE-10 | Medium | Buy | Enter a huge amount (e.g. 1e9) | Handled; blocked by max limit; no overflow/NaN | | | |
| EDGE-11 | Medium | Buy | Enter many decimals (e.g. 1.123456789) | Rounded/limited sensibly; no error spam | | | |
| EDGE-12 | Low | Buy | Leading zeros / `.5` / `5.` | Parsed sensibly | | | |
| EDGE-13 | Medium | Profile | Very long name / emoji in name | Saved or clearly rejected; no layout break | | | |
| EDGE-14 | Medium | Profile | Wallet address with surrounding spaces | Trimmed and accepted if valid | | | |
| EDGE-15 | Low | Profile | Wallet with wrong prefix/checksum | Rejected as invalid | | | |
| EDGE-16 | Medium | KYC | Start KYC, then start again before finishing | Reuses/represents one session; no duplicate confusion | | | |
| EDGE-17 | Medium | KYC | Return from DIDIT to the app tab that was closed | Reopen app → status polled correctly | | | |
| EDGE-18 | High | Buy | Cancel wallet signature prompt | Flow aborts cleanly; no tx started | | | |
| EDGE-19 | Medium | History | Open Activity immediately after a Buy completes | New tx appears (may need a refresh) — note lag if any | | | |
| EDGE-20 | Medium | Any | Two tabs performing different actions simultaneously | No interference | | | |
| EDGE-21 | Medium | Session | Sign out in tab A while tab B mid-Buy | Tab B's next protected call → sign-in; no orphaned charge | | | |
| EDGE-22 | Low | Nav | Deep-link directly to `/buy` / `/verify` while signed out | Redirect to sign-in, then honor destination (or land Home) | | | |
| EDGE-23 | Low | Nav | Unknown URL (`/nonsense`) | Clean 404/not-found; not a crash | | | |
| EDGE-24 | Medium | Auth | Use an email with `+tag` / uppercase | Normalized (lowercased); same account | | | |
| EDGE-25 | Medium | Buy | Slow/high-latency network during quote | Quote loading indicator; no stuck "—" forever | | | |
| EDGE-26 | Medium | Any | Browser autofill on email/OTP fields | Works; doesn't break validation | | | |
| EDGE-27 | Low | Any | Zoom to 200% / large font accessibility | Layout remains usable | | | |
| EDGE-28 | Medium | Buy | Start Buy without a linked/available wallet | Clear guidance to connect a wallet; no dead-end | | | |
| EDGE-29 | Medium | History | Filter to "In progress" when none are | Honest "nothing here" state | | | |
| EDGE-30 | Medium | KYC/Buy | Verify identity, then immediately Buy | KYC status reflected; if the payment step re-checks KYC by wallet, note any re-prompt (known gap) | | | |
| EDGE-31 | Low | Any | Very slow mailer (OTP delayed) | User can resend; old + new codes behave predictably | | | |
| EDGE-32 | Medium | Any | Multiple wallets linked; ensure history spans all of them | Transactions across all linked wallets appear | | | |

---

## 13. UX — subjective evaluation (answer after the run)

Rate 1–5 and note specifics:

- [ ] Did anything **confuse** me? Where?
- [ ] Did anything feel **slow** or laggy?
- [ ] At each step, did I **know what to do next**?
- [ ] Did I **trust** the product with money?
- [ ] Did anything feel like a **developer tool** (jargon, raw ids, blockchain terms leaking)?
- [ ] Were **error messages** human and reassuring (not scary/technical)?
- [ ] Did **empty states** feel intentional (not broken)?
- [ ] Did the **branding** feel like the anchor's own product, not a generic template?
- [ ] Did **loading / processing** states keep me informed?
- [ ] Would I **use this with real money**? If not, what's the #1 blocker?
- [ ] On mobile, did it feel like a **real banking app**?
- [ ] Anything that felt **unfinished** or "demo-grade"?

---

## Sign-off

| | Name | Date | Result summary |
|---|---|---|---|
| Tester | | | Pass __ / Fail __ / Partial __ / Blocked __ |
| Critical failures (must-fix before demo) | | | |
| Known/accepted limitations confirmed honest | | | |
