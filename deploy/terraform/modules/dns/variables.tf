variable "manage_dns" {
  description = "Create Route53 records."
  type        = bool
}

variable "create_zone" {
  description = "Create the hosted zone (vs. use an existing one)."
  type        = bool
}

variable "domain_name" {
  description = "Apex domain."
  type        = string
}

variable "route53_zone_id" {
  description = "Existing hosted zone id (when create_zone = false)."
  type        = string
}

variable "target_ip" {
  description = "Elastic IP the records point at."
  type        = string
}
