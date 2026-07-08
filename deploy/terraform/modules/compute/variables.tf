variable "name" {
  description = "Name prefix (project-environment)."
  type        = string
}

variable "project" {
  description = "Project slug — part of the log-group names."
  type        = string
}

variable "environment" {
  description = "Environment — part of the log-group names."
  type        = string
}

variable "subnet_id" {
  description = "Public subnet id for the host."
  type        = string
}

variable "security_group_id" {
  description = "EC2 security group id."
  type        = string
}

variable "instance_profile" {
  description = "IAM instance profile name."
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type."
  type        = string
}

variable "ami_id" {
  description = "AMI id, or empty for latest Amazon Linux 2023."
  type        = string
}

variable "key_name" {
  description = "EC2 key pair name, or empty for none (SSM)."
  type        = string
}

variable "root_volume_gb" {
  description = "Root EBS volume size (GB)."
  type        = number
}

variable "log_retention_days" {
  description = "CloudWatch log retention (days)."
  type        = number
}
