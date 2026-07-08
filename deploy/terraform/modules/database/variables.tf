variable "name" {
  description = "Name prefix (project-environment)."
  type        = string
}

variable "project" {
  description = "Project slug — part of the DB secret name."
  type        = string
}

variable "environment" {
  description = "Environment — part of the DB secret name."
  type        = string
}

variable "subnet_ids" {
  description = "Private subnet ids for the DB subnet group (>= 2 AZs)."
  type        = list(string)
}

variable "security_group_id" {
  description = "RDS security group id."
  type        = string
}

variable "instance_class" {
  description = "RDS instance class."
  type        = string
}

variable "allocated_storage" {
  description = "Initial storage (GB)."
  type        = number
}

variable "max_allocated_storage" {
  description = "Storage autoscaling ceiling (GB); 0 disables."
  type        = number
}

variable "engine_version" {
  description = "Postgres engine version."
  type        = string
}

variable "db_name" {
  description = "Initial database name."
  type        = string
}

variable "username" {
  description = "Master username (needs CREATEDB)."
  type        = string
}

variable "password" {
  description = "Master password."
  type        = string
  sensitive   = true
}

variable "backup_retention_days" {
  description = "Backup retention (days); > 0 enables backups + PITR."
  type        = number
}

variable "multi_az" {
  description = "Multi-AZ deployment."
  type        = bool
}

variable "deletion_protection" {
  description = "Deletion protection."
  type        = bool
}

variable "skip_final_snapshot" {
  description = "Skip final snapshot on destroy."
  type        = bool
}
