#!/usr/bin/env bash
# Resume the NordStern pilot for a demo. Starts RDS + EC2; Docker's restart policies bring the
# platform services AND every provisioned anchor back up automatically. Run ~5-10 min before
# the demo (RDS is the slow part). Verify with status.sh.
#
# Usage:  deploy/scripts/resume.sh
# Env:    AWS_REGION (default ap-south-1), NS_NAME (default nordstern-pilot)
set -euo pipefail

REGION="${AWS_REGION:-ap-south-1}"
NAME="${NS_NAME:-nordstern-pilot}"
RDS_ID="${NAME}-pg"

echo "▸ Region: $REGION   Project: $NAME"

# Start RDS first (it must be up before the app services reconnect).
RDS_STATE="$(aws rds describe-db-instances --region "$REGION" --db-instance-identifier "$RDS_ID" \
  --query 'DBInstances[0].DBInstanceStatus' --output text 2>/dev/null || echo "missing")"
if [ "$RDS_STATE" = "stopped" ]; then
  echo "▸ Starting RDS $RDS_ID …"
  aws rds start-db-instance --region "$REGION" --db-instance-identifier "$RDS_ID" >/dev/null
else
  echo "▸ RDS $RDS_ID is '$RDS_STATE' — leaving as is."
fi

# Start the EC2 box (its user-data + Docker restart policies bring the stack back).
INSTANCE_ID="$(aws ec2 describe-instances --region "$REGION" \
  --filters "Name=tag:Name,Values=${NAME}" "Name=instance-state-name,Values=stopped,stopping" \
  --query 'Reservations[].Instances[].InstanceId' --output text)"
if [ -n "$INSTANCE_ID" ]; then
  echo "▸ Starting EC2 $INSTANCE_ID …"
  aws ec2 start-instances --region "$REGION" --instance-ids $INSTANCE_ID >/dev/null
  echo "▸ Waiting for EC2 to reach 'running'…"
  aws ec2 wait instance-running --region "$REGION" --instance-ids $INSTANCE_ID
else
  echo "▸ No stopped EC2 instance found (already running?)."
fi

echo "✓ Resume requested. Give it ~3-5 min for RDS + Docker to settle, then run status.sh."
echo "  If anchors don't answer, on the box:  cd nordstern && docker compose -f docker-compose.platform.yml -f docker-compose.prod.yml up -d"
