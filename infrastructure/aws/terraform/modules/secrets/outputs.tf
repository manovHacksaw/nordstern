output "platform_secret_arn" {
  description = "ARN of the platform secrets bundle."
  value       = aws_secretsmanager_secret.platform.arn
}

output "platform_secret_name" {
  description = "Name of the platform secrets bundle (for `aws secretsmanager get-secret-value`)."
  value       = aws_secretsmanager_secret.platform.name
}

output "db_master_password" {
  description = "Generated RDS master password — consumed by the database module."
  value       = random_password.db_master.result
  sensitive   = true
}
