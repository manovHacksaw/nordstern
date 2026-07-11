output "status" {
  description = "DNS state — managed records, or the manual records to add."
  value       = var.manage_dns ? "Route53 managed: *.${var.domain_name} A -> ${var.target_ip} and ${var.domain_name} A -> ${var.target_ip}" : "DNS NOT managed by Terraform. Add these A records at your DNS provider:  *.${var.domain_name} -> ${var.target_ip}   and   ${var.domain_name} -> ${var.target_ip}"
}

output "zone_id" {
  description = "Hosted zone id used (empty when DNS is unmanaged)."
  value       = local.zone_id
}
