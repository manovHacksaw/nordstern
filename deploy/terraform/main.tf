# ─── NordStern pilot — single EC2 Docker host + RDS ──────────────────────────
# Modular, idempotent, least-privilege. One EC2 box runs the whole docker-compose
# stack (platform-api, console, control-plane, aggregator, Traefik, and every
# provisioned per-anchor stack); RDS holds all databases. See README for the deploy.

locals {
  name = "${var.project}-${var.environment}"
}

module "networking" {
  source = "./modules/networking"

  name              = local.name
  vpc_cidr          = var.vpc_cidr
  az_count          = var.az_count
  allowed_web_cidrs = var.allowed_web_cidrs
  enable_ssh        = var.enable_ssh
  allowed_ssh_cidrs = var.allowed_ssh_cidrs
}

module "iam" {
  source = "./modules/iam"

  name           = local.name
  secrets_prefix = var.secrets_prefix
  secrets_env    = var.secrets_env
  project        = var.project
  environment    = var.environment
}

module "secrets" {
  source = "./modules/secrets"

  name           = local.name
  project        = var.project
  environment    = var.environment
  resend_api_key = var.resend_api_key
  email_from     = var.email_from
  admin_username = var.admin_username
}

module "database" {
  source = "./modules/database"

  name                  = local.name
  project               = var.project
  environment           = var.environment
  subnet_ids            = module.networking.private_subnet_ids
  security_group_id     = module.networking.rds_security_group_id
  instance_class        = var.db_instance_class
  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  engine_version        = var.db_engine_version
  db_name               = var.db_name
  username              = var.db_username
  password              = module.secrets.db_master_password
  backup_retention_days = var.db_backup_retention_days
  multi_az              = var.db_multi_az
  deletion_protection   = var.db_deletion_protection
  skip_final_snapshot   = var.db_skip_final_snapshot
}

module "compute" {
  source = "./modules/compute"

  name               = local.name
  subnet_id          = module.networking.public_subnet_ids[0]
  security_group_id  = module.networking.ec2_security_group_id
  instance_profile   = module.iam.instance_profile_name
  instance_type      = var.ec2_instance_type
  ami_id             = var.ec2_ami_id
  key_name           = var.ec2_key_name
  root_volume_gb     = var.ec2_root_volume_gb
  log_retention_days = var.log_retention_days
  project            = var.project
  environment        = var.environment
}

module "dns" {
  source = "./modules/dns"

  manage_dns      = var.manage_dns
  create_zone     = var.create_route53_zone
  domain_name     = var.domain_name
  route53_zone_id = var.route53_zone_id
  target_ip       = module.compute.public_ip
}
