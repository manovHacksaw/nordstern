output "instance_profile_name" {
  description = "Instance profile to attach to the EC2 host."
  value       = aws_iam_instance_profile.ec2.name
}

output "role_arn" {
  description = "EC2 role ARN."
  value       = aws_iam_role.ec2.arn
}

output "role_name" {
  description = "EC2 role name."
  value       = aws_iam_role.ec2.name
}
