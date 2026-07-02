#!/usr/bin/env bash
# Start the anchor factory: base stack (db + traefik + control-plane + frontend).
# Per-anchor Anchor Platform + business-server containers are created dynamically
# by the control-plane once an operator provisions an anchor.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR/.."

cd "$ROOT"

if [ ! -f .env.base ]; then
  echo "ERROR: .env.base not found. Run 'node scripts/setup-base.mjs' first."
  exit 1
fi

# Load base env so docker compose can substitute ${MASTER_KEK} etc.
set -a
source .env.base
set +a

# The orchestrator runs per-anchor containers from these images, so make sure
# they exist locally before provisioning.
echo "Building business-server image (nordstern/business-server:dev)…"
docker build -t nordstern/business-server:dev ./business-server

echo "Pulling Anchor Platform image…"
docker pull stellar/anchor-platform:latest

echo "Starting base stack…"
docker compose up --build "$@"
