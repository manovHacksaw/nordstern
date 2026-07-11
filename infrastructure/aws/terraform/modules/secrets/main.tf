# Generates every platform secret so none are ever typed by hand or defaulted, and
# stores them as ONE JSON secret the Docker host reads at deploy time to build its
# .env. The RDS master password is generated here too and handed to the database
# module. (Per-anchor PSP secrets are NOT here — the control-plane creates those at
# runtime under <secrets_prefix>/<secrets_env>/anchor/<slug>.)

# MASTER_KEK must be base64 of 32 random bytes — identical shape to setup-base.mjs.
resource "random_id" "master_kek" {
  byte_length = 32
}

resource "random_password" "jwt_access" {
  length  = 48
  special = false
}

resource "random_password" "jwt_refresh" {
  length  = 48
  special = false
}

resource "random_password" "service_secret" {
  length  = 48
  special = false
}

resource "random_password" "cp_jwt" {
  length  = 32
  special = false
}

resource "random_password" "cp_service" {
  length  = 32
  special = false
}

resource "random_password" "admin_password" {
  length  = 24
  special = false
}

# RDS disallows / @ " and space in the master password — keep it alphanumeric.
resource "random_password" "db_master" {
  length  = 32
  special = false
}

resource "aws_secretsmanager_secret" "platform" {
  name        = "${var.project}/${var.environment}/platform"
  description = "NordStern platform secrets — read by the Docker host to build its .env."
}

resource "aws_secretsmanager_secret_version" "platform" {
  secret_id = aws_secretsmanager_secret.platform.id
  secret_string = jsonencode({
    # Keys are named exactly as the root .env / docker-compose interpolation expects.
    MASTER_KEK                  = random_id.master_kek.b64_std
    CP_JWT_SECRET               = random_password.cp_jwt.result
    CP_SERVICE_PASSWORD         = random_password.cp_service.result
    PLATFORM_JWT_ACCESS_SECRET  = random_password.jwt_access.result
    PLATFORM_JWT_REFRESH_SECRET = random_password.jwt_refresh.result
    SERVICE_SECRET              = random_password.service_secret.result
    ADMIN_USERNAME              = var.admin_username
    ADMIN_PASSWORD              = random_password.admin_password.result
    RESEND_API_KEY              = var.resend_api_key
    EMAIL_FROM                  = var.email_from
  })
}
