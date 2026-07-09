#!/usr/bin/env bash
# Pause the NordStern pilot to save AWS credits between demos.
# Stops the EC2 box (bills only EBS) and the RDS instance (bills only storage) → near-zero
# compute cost. All data (RDS databases, EBS) is preserved. Resume with resume.sh.
#
# The EC2 host runs the whole stack in Docker with restart policies (platform services AND
# every provisioned anchor — see orchestrator.ts RestartPolicy), so on resume everything comes
# back automatically when Docker starts on boot. No re-provisioning.
#
# Usage:  deploy/scripts/pause.sh
# Env:    AWS_REGION (default ap-south-1), NS_NAME (default nordstern-pilot)
set -euo pipefail

REGION="${AWS_REGION:-ap-south-1}"
NAME="${NS_NAME:-nordstern-pilot}"
RDS_ID="${NAME}-pg"

echo "▸ Region: $REGION   Project: $NAME"

# EC2: find the instance by the project Name tag. Terraform tags it "${NAME}-host"
# (RDS is "${NAME}-pg", the EIP "${NAME}-eip") — so the tag is the prefix + "-host", not bare.
INSTANCE_ID="$(aws ec2 describe-instances --region "$REGION" \
  --filters "Name=tag:Name,Values=${NAME}-host" "Name=instance-state-name,Values=running,pending,stopping" \
  --query 'Reservations[].Instances[].InstanceId' --output text)"

if [ -n "$INSTANCE_ID" ]; then
  echo "▸ Stopping EC2 $INSTANCE_ID …"
  aws ec2 stop-instances --region "$REGION" --instance-ids $INSTANCE_ID >/dev/null
else
  echo "▸ No running EC2 instance found (already stopped?)."
fi

# RDS: stop if it is available. (AWS auto-restarts a stopped RDS after 7 days — fine for a
# demo window; re-run pause.sh if it comes back before you need it.)
RDS_STATE="$(aws rds describe-db-instances --region "$REGION" --db-instance-identifier "$RDS_ID" \
  --query 'DBInstances[0].DBInstanceStatus' --output text 2>/dev/null || echo "missing")"
if [ "$RDS_STATE" = "available" ]; then
  echo "▸ Stopping RDS $RDS_ID …"
  aws rds stop-db-instance --region "$REGION" --db-instance-identifier "$RDS_ID" >/dev/null
elif [ "$RDS_STATE" = "missing" ]; then
  echo "▸ RDS $RDS_ID not found (nothing to stop)."
else
  echo "▸ RDS $RDS_ID is '$RDS_STATE' — not stopping."
fi

echo "✓ Pause requested. EC2 stops in ~1 min, RDS in a few min. Cost drops to storage-only."
echo "  Resume before your demo:  deploy/scripts/resume.sh"
