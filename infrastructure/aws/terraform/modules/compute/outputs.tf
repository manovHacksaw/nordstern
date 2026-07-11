output "instance_id" {
  description = "EC2 instance id."
  value       = aws_instance.this.id
}

output "public_ip" {
  description = "Elastic IP address."
  value       = aws_eip.this.public_ip
}

output "private_ip" {
  description = "Private IP."
  value       = aws_instance.this.private_ip
}

output "log_group_names" {
  description = "CloudWatch log groups for container logs."
  value = {
    platform = aws_cloudwatch_log_group.platform.name
    anchors  = aws_cloudwatch_log_group.anchors.name
  }
}
