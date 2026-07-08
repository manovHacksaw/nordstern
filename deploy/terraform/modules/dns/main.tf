# DNS is optional. If your zone lives in Route53, set manage_dns = true and Terraform
# creates the wildcard + apex A records at the Elastic IP. If DNS lives on Cloudflare
# or a registrar, leave manage_dns = false — nothing is created and the `status` output
# tells you exactly which record to add by hand. The wildcard *.<domain> is what makes
# every provisioned anchor (<slug>.<domain>, console-<slug>.<domain>) resolve.

resource "aws_route53_zone" "this" {
  count = var.manage_dns && var.create_zone ? 1 : 0
  name  = var.domain_name
}

locals {
  zone_id = var.create_zone ? (length(aws_route53_zone.this) > 0 ? aws_route53_zone.this[0].zone_id : "") : var.route53_zone_id
}

resource "aws_route53_record" "wildcard" {
  count   = var.manage_dns ? 1 : 0
  zone_id = local.zone_id
  name    = "*.${var.domain_name}"
  type    = "A"
  ttl     = 300
  records = [var.target_ip]
}

resource "aws_route53_record" "apex" {
  count   = var.manage_dns ? 1 : 0
  zone_id = local.zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = [var.target_ip]
}
