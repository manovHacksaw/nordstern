# R6 M2 — CI Foundation: complete (M2-a → M2-d)

> All four sub-milestones implemented, verified green on PR #2, and pushed.
> Branch: `feat/platform-infra-and-money-safety`.

## M2-d — Docker build validation

### Docker image inventory

| # | Image (context) | Runtime | Stages | In CI? | Notes |
|--:|---|---|:--:|:--:|---|
| 1 | `platform/api` | node:20-alpine | 1 | ✅ | platform-api + platform-migrate (same Dockerfile) |
| 2 | `anchor-service/business-server` | node:20-alpine | 1 | ✅ | built by dev.sh (`nordstern/business-server:dev`) |
| 3 | `anchor-service/client` | node:20-alpine | 2 | ✅ | anchor-service customer app |
| 4 | `anchor-service/control-plane` | node:20-alpine | 2 | ✅ | provisioning control plane |
| 5 | `anchor-template/aggregator-service` | node:20-alpine | 1 | ✅ | routing/aggregator |
| 6 | `anchor-template/anchor-client` | node:20-alpine | 2 | ✅ | needs `--legacy-peer-deps` (in Dockerfile); M8 dup candidate |
| 7 | `anchor-template/business-server` | node:20-alpine | 1 | ✅ | per-anchor money server (owns money tables) |
| 8 | `anchor-template/client` | node:20-alpine | 3 | ✅ | R3.5 branded customer app; `--legacy-peer-deps` |
| 9 | `anchor-template/console` | node:20-alpine | 2 | ✅ | R3 operator console |
| — | `sep24-reference-ui` | — | — | ❌ | upstream reference UI (not ours) |
| — | `anchor-platform/*` | — | — | ❌ | upstream Java clone (its own CI) |

**Included: 9. Excluded: upstream reference/clone only.** All 9 build successfully
(verified locally *and* in CI). No Dockerfile changes were required.

### Path-filter strategy
`dorny/paths-filter@v3` maps each image → its context glob (plus `docker.yml`
itself). The filter emits a JSON array of changed image dirs, consumed as a
dynamic build matrix — so a PR builds **only** the images it touches. The
workflow itself runs on every PR (no workflow-level path filter) so the required
`docker-required` check always reports (deadlock-safe).

### Build matrix & runtime
Dynamic `matrix.image = fromJSON(changes.outputs.images)`, `fail-fast:false`.
On PR #2 (touches everything) all 9 built in parallel in **~2m27s** wall-clock
(slowest: `anchor-template/client` 2m1s; fastest: `aggregator` 23s). Typical PRs
touch 0–1 images → near-zero Docker time.

### Cache strategy
`docker/setup-buildx-action` + `docker/build-push-action@v6` with
`cache-from/to: type=gha, mode=max`, **scoped per image** so layer caches don't
collide. `push:false` + `load:false` → image built in BuildKit and discarded
(no export, no registry). Correctness-first; caching is best-effort.

### Extensibility (ready, no restructure)
The `build` job is the seam for later: image signing, SBOM, vuln scanning, and
registry publishing all attach as extra steps behind a `push`/tag condition;
none require reworking the matrix or path filter.

---

## Full M2 recap

| Sub-milestone | Delivered | Required check |
|---|---|---|
| **M2-a** | `ci.yml` — build/typecheck matrix over 13 workspaces + non-blocking lint; composite `setup` action; Node 22 LTS | `ci-required` |
| **M2-b** | `security.yml` — gitleaks (PR range), committed-artifact hygiene guard, advisory `npm audit` | `secret-scan`, `hygiene` |
| **M2-c** | `db.yml` — Drizzle migration consistency (blocking) + advisory schema-drift detection | `drizzle-migrations` |
| **M2-d** | `docker.yml` — path-filtered build validation of all 9 images | `docker-required` |

Four independent, modular workflows; all reuse the shared composite setup where
applicable; `ci.yml` never touched by later milestones.

### Production risks eliminated by M2
- **Silent build breakage** — every service typechecks/builds on every PR.
- **Committed secrets** — gitleaks blocks new secrets in the PR diff.
- **Artifact/secret hygiene regressions** — the M1 baseline is now CI-enforced forever.
- **Silent schema drift** — Drizzle drift is now *visible* (and platform/api's real drift was surfaced, queued for M4).
- **Silent container-build breakage** — no PR can merge a broken Docker image unnoticed.
- **Dependency blindness** — vulnerability counts surfaced per workspace (advisory).

### Genuine debt surfaced (not masked) during M2
- `platform/console` `/redeem` prerender bug — **fixed** (M2-a).
- `frontend/landing` stale lockfile — **fixed** (M2-a).
- `platform/api` schema drift (`secret_refs`, `branding`, `applications` restructure) — **documented, deferred to M4**.
- Two parallel stacks / `anchor-client` vs `client` duplication — **flagged for M8**.

### Production-readiness score movement (vs. pre-M2)

| Subsystem | Pre-M2 | Post-M2 | Why |
|---|:--:|:--:|---|
| Testing/CI | **1** | **5** | Full CI gate (build/typecheck/secret/hygiene/db/docker) on every PR; automated *tests* still pending (M3) |
| Security | 5 | **6** | Secret scanning + hygiene enforcement + dependency visibility |
| Reliability | 5 | **6** | Schema drift now detectable; build reproducibility enforced |
| Developer Experience | 5 | **6** | Green-gate feedback, per-PR checks, branch-protection ruleset |
| _Overall platform_ | ~4 | **~5** | Foundation hardened; correctness net exists, but no behavior-level test coverage yet |

### What remains for M3 (Money-Flow Tests)
M2 proves code **builds and is hygienic**; it does **not** prove code is
**correct**. M3 adds the automated test safety net over the irreversible paths:
idempotent deposit release, withdrawal poller dedupe, SecretStore masking,
redeem/branding sanitization + provisioning retry, auth/session scoping — via
Vitest + Testcontainers Postgres + LocalStack, wired into the `ci.yml` `test`
slot that M2-a intentionally left open.

**M2 is officially complete.**
