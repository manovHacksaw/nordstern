# Aggregator

The **registry and routing engine** for live anchors.

## What it is

An Express/TypeScript service (`nordstern-aggregator-service`, port **3005**) that holds a registry of live anchors plus a health / routing / quote engine and background workers. The Platform API registers each newly-live anchor here; wallets and integrators query it to discover a route and get a quote.

## Why it exists

Once there are many anchors, someone has to answer "which anchor should serve this INR→USDC request, and at what price?" The aggregator is that layer — a registry today, and the home for telemetry-ranked routing (success rate, speed, FX spread) and SEP-38 quote multiplexing as the platform grows.

## Run it independently

```bash
cd anchor-template/aggregator-service
npm install
npm run dev            # on :3005
```

Needs a Postgres reachable at `DATABASE_URL` with the `aggregatordb` schema.

## Required environment

| Variable | Purpose |
|---|---|
| `PORT` | Listen port (3005). |
| `DATABASE_URL` | Postgres `aggregatordb`. |

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Dev server. |
| `npm run db:migrate` / `db:migrate:down` | `node-pg-migrate` on `aggregatordb`. |
| `npm run typecheck` | `tsc --noEmit`. |

## Endpoints (illustrative)

`GET /anchors` (registry) · `POST /quote` · `POST /route` · `POST /transactions/start` (returns real SEP handoff endpoints for a wallet to drive). See [`infrastructure/docker/README.md`](../../infrastructure/docker/README.md) for the full curl flow.

## Dependencies & interactions

Express · `pg`. Populated by the **Platform API** as anchors go live; queried by wallets/integrators; hands off to each anchor's real SEP endpoints (it holds no user key and never executes the transaction itself).
