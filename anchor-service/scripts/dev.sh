#!/usr/bin/env bash
# Canonical local dev launcher for the NordStern platform.
#
# Builds the per-anchor images the provisioner launches, then brings up the connected
# platform stack (docker-compose.platform.yml). This is the SINGLE supported way to run
# NordStern locally — the old standalone anchor-service stack was retired.
#
#   node scripts/setup-base.mjs   # one-time: writes .env.base (MASTER_KEK, config dir)
#   ./scripts/dev.sh              # build images + up the platform
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANCHOR_SERVICE="$SCRIPT_DIR/.."
REPO_ROOT="$ANCHOR_SERVICE/.."

if [ ! -f "$ANCHOR_SERVICE/.env.base" ]; then
  echo "ERROR: anchor-service/.env.base not found. Run 'node scripts/setup-base.mjs' first."
  exit 1
fi

echo "▸ Building the per-anchor images the provisioner launches (from anchor-template/*)…"
docker build -t nordstern/business-server:dev  "$REPO_ROOT/anchor-template/business-server"
docker build -t nordstern/anchor-client:dev     "$REPO_ROOT/anchor-template/anchor-client"
docker build -t nordstern/operator-console:dev  "$REPO_ROOT/anchor-template/console"

echo "▸ Pulling the Anchor Platform image…"
docker pull stellar/anchor-platform:latest

echo "▸ Starting the connected platform stack (docker-compose.platform.yml)…"
docker compose --env-file "$ANCHOR_SERVICE/.env.base" \
  -f "$REPO_ROOT/docker-compose.platform.yml" up -d --build "$@"

echo "✓ Platform up. Founder: http://register.localhost:4001  Admin: http://admin.localhost:4002"
