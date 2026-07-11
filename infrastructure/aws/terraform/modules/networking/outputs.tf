output "vpc_id" {
  description = "VPC id."
  value       = aws_vpc.this.id
}

output "public_subnet_ids" {
  description = "Public subnet ids (EC2)."
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Private subnet ids (RDS)."
  value       = aws_subnet.private[*].id
}

output "ec2_security_group_id" {
  description = "Security group for the Docker host."
  value       = aws_security_group.ec2.id
}

output "rds_security_group_id" {
  description = "Security group for RDS."
  value       = aws_security_group.rds.id
}
