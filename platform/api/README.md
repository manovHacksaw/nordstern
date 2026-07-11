# Platform API

The always-on **brain of the NordStern platform** — the onboarding, identity, and orchestration service that every console and provisioned anchor talks to.

## What it is

An Express/TypeScript service (`@nordstern/platform-api`, port **4000**) that owns:

- **Onboarding** — anchor applications, organizations & memberships.
- **Auth** — three OTP-based realms (operator / customer / admin) separated by JWT `typ` claim, host-only cookies, server-side sessions.
- **Customer identity** — email-OTP, attached Stellar wallets, reusable KYC.
- **Secret refs** — pointers to the SecretStore (values live in AWS Secrets Manager / LocalStack, never in Postgres).
- **Audit log** and the **email lifecycle** (OTP + application received/approved/rejected + anchor-live) via Resend, with a console-logging fallback.

It **drives the provisioner** (control-plane) and **registers live anchors** with the aggregator.

## Why it exists

The Anchor Platform owns the SEP protocol; the per-anchor business-server owns money movement. The Platform API owns everything *above* a single anchor — who can create one, who operates it, and how onboarding and identity work across the whole platform.

## Run it independently

```bash
cd platform/api
npm install
npm run dev            # tsx watch on :4000
```

Needs a Postgres reachable at `DATABASE_URL` with the `platformdb` schema pushed (`npm run db:generate` / drizzle). In the full stack this is handled by `infrastructure/docker/platform.yml` (the `platform-migrate` one-shot).

## Required environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres `platformdb`. |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Session signing (server refuses to boot in prod with weak/default values). |
| `SERVICE_SECRET` | Backend→platform service calls (e.g. business-server propagating a KYC decision). |
| `CONTROL_PLANE_URL`, `AGGREGATOR_URL`, `CP_SERVICE_PASSWORD` | Wiring to the provisioner + aggregator. |
| `RESEND_API_KEY`, `EMAIL_FROM` | Transactional email (unset → emails are logged). |
| `SECRETS_*`, `AWS_*` | SecretStore backend (LocalStack in dev, IAM in prod). |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Internal admin login (defaults `admin`/`admin` in dev; prod fail-closes on weak values). |

See [`.env.example`](.env.example).

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Hot-reload dev server. |
| `npm run db:generate` / `db:migrate` / `db:studio` | Drizzle schema tooling. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm test` | Vitest — SecretStore suite against a **real LocalStack** (Docker required). |

## Dependencies & interactions

Express · Zod · Helmet · `pino` · `express-rate-limit` · `jsonwebtoken` · Resend · Drizzle ORM (`platformdb`) · `@aws-sdk/client-secrets-manager`. Calls the **control-plane** (`:3002`) to provision, the **aggregator** (`:3005`) to register anchors, and reads/writes the **SecretStore**. Consumed by the founder/admin consoles (same-origin `/api`) and by each anchor's business-server (KYC propagation).
