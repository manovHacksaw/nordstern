#!/usr/bin/env bash
# Show the pilot's current running state + a rough cost read, so you know whether you're
# burning credits. Usage: deploy/scripts/status.sh
set -euo pipefail

REGION="${AWS_REGION:-ap-south-1}"
NAME="${NS_NAME:-nordstern-pilot}"
RDS_ID="${NAME}-pg"

echo "▸ Region: $REGION   Project: $NAME"

EC2="$(aws ec2 describe-instances --region "$REGION" \
  --filters "Name=tag:Name,Values=${NAME}-host" \
  --query 'Reservations[].Instances[].[InstanceId,State.Name,InstanceType]' --output text 2>/dev/null || true)"
echo "── EC2 ──"; [ -n "$EC2" ] && echo "$EC2" || echo "  (none)"

RDS="$(aws rds describe-db-instances --region "$REGION" --db-instance-identifier "$RDS_ID" \
  --query 'DBInstances[0].[DBInstanceStatus,DBInstanceClass]' --output text 2>/dev/null || echo "missing")"
echo "── RDS ──"; echo "  $RDS_ID: $RDS"

echo "── Cost read ──"
if echo "$EC2" | grep -q running || [ "$(echo "$RDS" | awk '{print $1}')" = "available" ]; then
  echo "  ⚠ RUNNING — billing compute. Run pause.sh when idle to save credits."
else
  echo "  ✓ PAUSED — storage-only cost. Run resume.sh before your demo."
fi
