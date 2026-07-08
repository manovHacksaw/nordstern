# ─── Outputs — everything you need for the post-apply deploy ─────────────────

output "ec2_public_ip" {
  description = "Elastic IP of the Docker host. Point *.<domain> and <domain> at this."
  value       = module.compute.public_ip
}

output "ec2_instance_id" {
  description = "EC2 instance id (use with `aws ssm start-session --target <id>`)."
  value       = module.compute.instance_id
}

output "rds_endpoint" {
  description = "RDS endpoint host:port. Build DATABASE_URLs against this."
  value       = module.database.endpoint
}

output "rds_address" {
  description = "RDS hostname (no port)."
  value       = module.database.address
}

output "rds_initial_db" {
  description = "The initial database RDS created. Create platformdb/controldb/aggregatordb next — see README."
  value       = module.database.db_name
}

output "platform_secret_arn" {
  description = "Secrets Manager ARN holding the platform secrets (JWT, MASTER_KEK, admin, Resend). The instance reads it at deploy."
  value       = module.secrets.platform_secret_arn
}

output "database_secret_arn" {
  description = "Secrets Manager ARN holding the DB connection (host/user/password + DATABASE_URL base)."
  value       = module.database.secret_arn
}

output "log_group_names" {
  description = "CloudWatch log groups for the platform + per-anchor container logs."
  value       = module.compute.log_group_names
}

output "dns_status" {
  description = "Whether Terraform manages DNS, or the manual record you must add."
  value       = module.dns.status
}

output "next_steps" {
  description = "Pointer to the post-apply deploy runbook."
  value       = "Terraform provisioned infra only. Follow deploy/terraform/README.md §'After apply' to create the databases, pull secrets, and bring the stack up."
}
