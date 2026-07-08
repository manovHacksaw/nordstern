variable "name" {
  description = "Name prefix (project-environment)."
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR."
  type        = string
}

variable "az_count" {
  description = "Number of AZs (>= 2 for RDS)."
  type        = number
}

variable "allowed_web_cidrs" {
  description = "CIDRs allowed to reach 80/443."
  type        = list(string)
}

variable "enable_ssh" {
  description = "Open port 22."
  type        = bool
}

variable "allowed_ssh_cidrs" {
  description = "CIDRs allowed to SSH when enable_ssh = true."
  type        = list(string)
}
