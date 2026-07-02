# Decision Log

## DL-001 — Business Server Language: TypeScript (Node.js)
- **Decision:** TypeScript with Node.js for the Business Server
- **Alternatives:** Kotlin/Spring Boot, Java/Spring Boot
- **Why chosen:** Preference. The Anchor Platform callback API is a plain HTTP contract — any language works.
- **Tradeoffs:** No official TypeScript Anchor SDK. We implement the callback API contract manually using `@stellar/stellar-sdk` for Stellar operations.

## DL-002 — Container Strategy: Docker Compose
- **Decision:** Docker Compose for local orchestration
- **Alternatives:** Kubernetes (k3d/minikube)
- **Why chosen:** Official Anchor Platform approach. Single file, minimal setup friction, easy to reason about service boundaries.
- **Tradeoffs:** Not production-representative. Will need migration to k8s or similar for real deployment.

## DL-003 — Network: Stellar Testnet
- **Decision:** Stellar Testnet
- **Alternatives:** Futurenet
- **Why chosen:** Standard starting point. Free XLM via Friendbot, stable, wallets support it, resets quarterly.
- **Tradeoffs:** Resets every quarter — keypairs and assets are wiped. Never use testnet keys/assets for anything real.

## DL-004 — Asset Code: ANCH
- **Decision:** `ANCH` as the test asset code
- **Alternatives:** USDA, ANCHRUSD, TESTX
- **Why chosen:** Short (4 chars), memorable, clearly identifies this as our anchor's asset.
- **Tradeoffs:** Not a real stablecoin name. In production this would be something like USDC, KESH, etc.

## DL-005 — Multi-anchor isolation: one full stack per anchor
- **Decision:** Each anchor runs as its own isolated stack (dedicated Anchor Platform container + business-server container + subdomain + keys + asset + database). An operator owns many anchors, managed from a console.
- **Alternatives:** Shared multi-asset Anchor Platform with a tenant-aware business-server (logical tenancy).
- **Why chosen:** Physical isolation is the strongest boundary between anchors and keeps each business-server single-tenant (simpler). Chosen deliberately with the product owner.
- **Tradeoffs:** **Amends DL-002** — we now run a container-orchestration layer instead of a single static Compose file. Higher resource footprint; needs dynamic container management, cleanup, and a reverse proxy. Production still needs k8s (DL-002's concern stands).

## DL-006 — Orchestration via Docker Engine API + Traefik
- **Decision:** The control-plane provisions anchors by calling the Docker Engine API (`dockerode`, mounting `/var/run/docker.sock`); Traefik (docker provider) routes `<slug>.anchors.localhost` → the anchor's AP, with a higher-priority `/sep24/interactive` rule → its business-server.
- **Alternatives:** Compose-per-project (`docker compose -p`), full k8s operator now.
- **Why chosen:** Runs on a laptop with just Docker, integrates with the existing Compose base, and Traefik auto-discovers dynamic containers via labels.
- **Tradeoffs:** Docker-socket access is a privilege-escalation surface (documented, dev-only). Adding an asset requires a container lifecycle, not a hot reload — fine since each anchor is its own container.

## DL-007 — Secrets encrypted at rest (envelope encryption)
- **Decision:** Anchor secret seeds (and vendor creds) are stored AES-256-GCM-encrypted in `controldb`, keyed by a `MASTER_KEK` from env. Replaces the old plaintext `tenant_keypairs.secret_key` column.
- **Alternatives:** Plaintext (previous state), external KMS/HSM now.
- **Why chosen:** Removes a real liability with no new infra. KMS/HSM is the production upgrade path.
- **Tradeoffs:** Losing `MASTER_KEK` makes stored secrets unrecoverable — acceptable on testnet (re-provision).

## DL-008 — Per-anchor Anchor Platform config generated from templates
- **Decision:** The control-plane renders each anchor's `anchor-platform.yaml`, `stellar.toml`, and `assets.yaml` from templates (per-slug home domain, callback URL, database, asset) into a shared host dir bind-mounted into that anchor's AP container.
- **Why chosen:** One AP image, many anchors, each with correct SEP-1/10/24 config, without hand-editing files.
- **Tradeoffs:** Host-path/bind-mount coordination between sibling containers (`ANCHOR_CONFIG_HOST_ROOT`) is the most error-prone part.

## DL-009 — First real adapter: surepass KYC (sandbox)
- **Decision:** `KycProvider` gains a real `surepass` (sandbox) implementation behind the SEP-12 seam; mock stays the default. Other seams (payout/deposit/fee) remain mock this pass.
- **Why chosen:** Proves a real vendor end-to-end without moving money; India-relevant identity verification.
- **Tradeoffs:** Stores verification outcome only (no raw PAN/Aadhaar) — see COMPLIANCE Q5. Exact surepass endpoint/field mapping still to be confirmed against their docs; provider degrades gracefully if unreachable.
