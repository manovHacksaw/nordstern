# Founder onboarding — audit, gap analysis & roadmap

> Phase 1 (audit only, no implementation). The goal: a founder discovers NordStern → applies →
> gets reviewed/approved → activates → launches a live white-label anchor, feeling like opening
> a Stripe/Mercury/Modern Treasury account, never touching APIs. Verified against the running
> stack, 2026-07-08.

## 1. What exists today (verified)

### Backend (platform-api `:4000`) — mostly present, high reuse
| Capability | Endpoint(s) | State |
|---|---|---|
| Submit application | `POST /api/v1/applications` (public; `{profile, product}` freeform jsonb) | ✅ exists |
| List applications | `GET /api/v1/applications` (requireAuth) | ✅ exists |
| Approve application | `POST /api/v1/applications/:id/approve` (requireAuth) → sets `approved`, mints a 7-day invitation token, returns `rawToken` | ✅ exists (but token is **not emailed** — see gaps) |
| Verify invitation | `GET /api/v1/anchor-invitations/verify?token=` | ✅ exists |
| **Redeem → provision** | `POST /api/v1/anchor-invitations/redeem` `{token, subdomain, fullName, password, credentials, branding}` → creates org+user+membership+anchor + a provisioning job; drives the **real control-plane lifecycle** | ✅ exists (the crown jewel) |
| Provisioning status | `GET /api/v1/anchor-invitations/status/:jobId` (real stage strings) + `/retry` | ✅ exists |
| PSP credentials | `credentials` on redeem → **SecretStore** (never echoed) | ✅ exists |
| **Provisioning engine** | control-plane + `provisionerService` (keys → Friendbot → asset issue → containers → health → aggregator register) | ✅ **works fully — reuse as-is** |
| Email pipeline | `mailer`: `sendVerificationEmail`, `sendPasswordResetEmail`, **`sendOtpEmail`**, `sendInvitationEmail` | ✅ exists |
| Operator identity | `users` + orgs + memberships; auth = **password (bcrypt) + email verify** | ✅ exists — but **password-based** |

### Frontend (platform/console) — partial, and NOT running
Screens that exist: `register`, `login`, `verify-email`, `forgot/reset-password`, `redeem`
(labelled "Application Received — Production Review"), `(app)/overview`, `(app)/wallet`, `/` (landing stub).
**The console is not deployed in the running stack** (no `platform-console` container) — so none of it is reachable today.

## 2. Gap analysis (per founder-journey step)

| Step | Exists? | Gap |
|---|---|---|
| 1 · Landing | ✅ (locked) | Only wire the CTA destination to founder registration |
| 2 · Anchor registration | 🟡 | Screen exists (`register`) but is **password-based**; user wants **passwordless OTP**. `sendOtpEmail` exists but the `users` domain has no OTP auth. Also should create an **application draft** on verify |
| 3 · Business application wizard | 🔴 | **No wizard UI.** Only a raw `POST /applications` with freeform `{profile, product}`. No multi-step (Business / Details / Anchor config / Compliance / Branding / Review). No field schema |
| 4 · Application submitted | 🔴 | **No waiting/status page** for the applicant |
| 5 · Internal review | 🔴 | **No NordStern internal dashboard.** No super-admin role. `list` + `approve` APIs exist, but **no reject / request-changes**, no document viewer, no reviewer UX |
| 6 · Approval email | 🟡 | `approve` mints the token but **does not send it**. `sendInvitationEmail` exists but isn't wired to approval |
| 7 · Activation wizard | 🟡 | Redeem endpoint collects subdomain/branding/credentials, but the **UI is one page**, not a multi-step launch config. Also creates a **password** user (should be OTP) |
| 8 · Provisioning + "live" | 🟡 | Real status API exists (`status/:jobId`); redeem page shows basic progress. Needs the polished **"Your Anchor is live" + 4 URLs** screen |
| 9 · First login (operator console) | 🟡 | Operator console login proxies to platform-api **password** auth; user wants **OTP** |
| — · Document upload (compliance) | 🔴 | **No backend** for uploading/storing KYB/licence documents |

**Placeholder / redesign candidates:** the `redeem` page (redesign into the activation wizard);
the `register` page (redesign to OTP); `(app)/overview` (post-launch home).

## 3. The one consequential decision: **operator/founder auth → passwordless OTP**

Today operators use passwords; the founder journey (and the earlier platform direction) wants
**OTP, no passwords, whole-platform**. We already have a **working OTP implementation** — the
`customers` domain (`customer_otps`, `sendOtpEmail`, `ns_customer` session). Recommended:
**extend the same OTP pattern to the `users`/operator domain** (a `user_otps` table + OTP
request/verify on the `auth` router, issuing the existing `ns_access`/`ns_refresh` session).
Redeem then creates an OTP user (no password). Do **not** build a parallel identity system —
reuse the `users`/orgs/sessions that already exist; only the *credential* changes.

## 4. UX flow (target)

```
Landing (locked)  ──"Become an anchor"──▶  Register (email → OTP)  ──▶  Application draft created
      │
      ▼
Application Wizard (Business · Details · Anchor config · Compliance · Branding · Review)
      │ submit
      ▼
Application Submitted  (waiting page: what's next, timeline, email updates, support)
      │
      ▼    ┌─────────────────────────────────────────────────────────┐
NordStern  │ Internal Review (super-admin): inspect · docs · approve  │  ← reuse approve API
  Ops   ───│  / reject / request-changes                              │     + add reject/changes
      ▼    └─────────────────────────────────────────────────────────┘
Approval Email (activation link)   ← reuse sendInvitationEmail, wire to approve
      │
      ▼
Activation Wizard (confirm domain · branding · Stellar wallet · PSP creds · treasury · confirm)
      │  ── reuses POST /anchor-invitations/redeem (NO new provisioning logic)
      ▼
Provisioning (real status stream)  ── GET /status/:jobId
      ▼
"Your Anchor is live"  →  Customer URL · Operator Console URL · API URL · SEP URL
      ▼
First login at console.<anchor>…  (email → OTP)
```

## 5. Screen list (build targets)

**Founder (new `founder`/`platform` web app, or extend platform/console):**
1. Register (email → OTP) — *redesign of existing register*
2. Application wizard (6 steps) — **new**
3. Application submitted / status — **new**
4. Activation wizard (5 steps) — *redesign of redeem*
5. Provisioning progress + "Anchor is live" — *upgrade of redeem status*
6. Post-launch home (my anchors, URLs, status) — *reuse `(app)/overview`*

**NordStern internal (super-admin):**
7. Applications review queue — **new**
8. Application detail (profile, docs, decision: approve/reject/request-changes) — **new**

**Operator console (existing):** first-login OTP — *change of existing login*

## 6. Backend reuse map

| Founder need | Reuse (no new logic) | New backend required |
|---|---|---|
| Register | `users`/orgs/sessions/mailer | **OTP for users** (`user_otps` + auth OTP endpoints) |
| Application draft + submit | `applications` (POST/GET), `applicationsRepo` | **typed field schema** on `profile`/`product`; **draft** state; **document upload** endpoint + storage |
| Internal review | `GET /applications`, `POST /:id/approve`, `auditLogs` | **super-admin role**; `reject` / `request-changes` transitions |
| Approval email | `sendInvitationEmail`, approve's `rawToken` | **wire** approve → email (activation link) |
| Activation | `POST /anchor-invitations/redeem`, `credentials`→SecretStore | make user creation **OTP** (no password) |
| Provisioning | control-plane + `provisionerService` + `status/:jobId` + `/retry` | **none** |
| Live URLs | provisioning `result.homeDomain` + naming | **none** (derive console/api/sep hosts) |
| First login | operator console `/api` proxy + platform auth | **OTP** (same as register) |

## 7. Missing backend capabilities (the only new backend)

1. **Operator OTP auth** — `user_otps` table + `POST /auth/otp/request` + `/auth/otp/verify` (reuse the customer-OTP code paths + existing session issuance). *Small.*
2. **Application field schema + draft state** — structured `profile`/`product` (no new table; typed JSON) + a `draft` status before `applied`. *Small.*
3. **Document upload** — endpoint + object storage (S3/LocalStack, mirroring SecretStore's dev/prod parity) + `application_documents` refs. *Medium; new dependency.*
4. **Application decisions** — `reject` + `request-changes` transitions + reason, and a **super-admin role** to gate the review dashboard. *Small.*
5. **Wire approval email** — approve → `sendInvitationEmail(activationLink)`. *Trivial.*
Everything else is **UI + reuse**. Provisioning gets **zero** new logic.

## 8. Implementation roadmap (small, independently reviewable milestones)

- **M0 — Make the surface reachable.** Deploy `platform/console` in the stack; point the (locked) landing CTA at it. *(no product logic)*
- **M1 — Operator OTP auth.** `user_otps` + request/verify endpoints reusing the customer-OTP pattern; issue existing sessions; keep password login working during transition. *(backend)*
- **M2 — Register → application draft.** OTP register screen; on verify, create a `draft` application. *(UI + small backend)*
- **M3 — Application wizard.** 6-step premium wizard over `applications` with a typed field schema; save-as-draft; submit → `applied`. *(UI + schema)*
- **M4 — Application submitted page.** Waiting/status screen for the applicant. *(UI)*
- **M5 — Internal review dashboard.** Super-admin role; review queue + detail; approve/reject/request-changes; wire approval email. *(UI + small backend)*
- **M6 — Activation wizard.** Redesign redeem into a 5-step launch config (domain/branding/wallet/PSP/treasury/confirm) over the **existing** redeem endpoint; OTP user creation. *(UI)*
- **M7 — Provisioning + "Anchor is live".** Polished real-status stream + the 4-URL success screen over `status/:jobId`. *(UI)*
- **M8 — Document upload (compliance).** Upload endpoint + object store + `application_documents`; surface in wizard + review. *(backend + UI)*
- **M9 — Operator console first-login OTP.** Switch console login to OTP. *(UI, uses M1)*

**Sequencing note:** M1 (OTP) unblocks M2/M6/M9. M5 needs a super-admin role (also the missing
Product-4 primitive). M8 is the only one adding a new infra dependency (object storage) and can
be deferred behind an honest "upload later" state if a demo needs to skip it.

## 9. Constraints honored
No parallel systems · reuse `users`/orgs/sessions/applications/anchor-invitations/control-plane/
mailer/SecretStore · provisioning engine untouched · landing locked (CTA destination only) ·
**no mock data** — every screen renders real backend data or an honest empty state.
```
```
