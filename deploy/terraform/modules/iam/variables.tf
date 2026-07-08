variable "name" {
  description = "Name prefix (project-environment)."
  type        = string
}

variable "project" {
  description = "Project slug — scopes the platform/database secret + log-group ARNs."
  type        = string
}

variable "environment" {
  description = "Environment — scopes the platform/database secret + log-group ARNs."
  type        = string
}

variable "secrets_prefix" {
  description = "App SECRETS_PREFIX — scopes the per-anchor secret ARNs."
  type        = string
}

variable "secrets_env" {
  description = "App SECRETS_ENV — scopes the per-anchor secret ARNs."
  type        = string
}
