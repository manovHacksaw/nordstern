variable "name" {
  description = "Name prefix (project-environment)."
  type        = string
}

variable "project" {
  description = "Project slug — part of the secret name."
  type        = string
}

variable "environment" {
  description = "Environment — part of the secret name."
  type        = string
}

variable "resend_api_key" {
  description = "Resend API key (real external secret)."
  type        = string
  sensitive   = true
}

variable "email_from" {
  description = "Email From address (verified Resend domain)."
  type        = string
}

variable "admin_username" {
  description = "Internal admin-panel username."
  type        = string
}
