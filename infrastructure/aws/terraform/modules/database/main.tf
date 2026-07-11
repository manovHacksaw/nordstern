# RDS Postgres — private subnets only, encrypted, with automated backups + PITR.
# The master user has CREATEDB so the control-plane can create per-anchor databases
# (anchordb_<slug>) exactly as it does locally. Storage autoscales to a ceiling.

resource "aws_db_subnet_group" "this" {
  name       = "${var.name}-db"
  subnet_ids = var.subnet_ids
  tags       = { Name = "${var.name}-db" }
}

resource "aws_db_instance" "this" {
  identifier     = "${var.name}-pg"
  engine         = "postgres"
  engine_version = var.engine_version
  instance_class = var.instance_class

  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage > 0 ? var.max_allocated_storage : null
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = var.db_name
  username = var.username
  password = var.password
  port     = 5432

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [var.security_group_id]
  publicly_accessible    = false
  multi_az               = var.multi_az

  # backup_retention_period > 0 enables automated daily backups AND point-in-time
  # recovery (transaction-log restore to any second within the window).
  backup_retention_period = var.backup_retention_days
  backup_window           = "17:00-18:00"
  maintenance_window      = "Mon:18:30-Mon:19:30"
  copy_tags_to_snapshot   = true

  auto_minor_version_upgrade = true
  deletion_protection        = var.deletion_protection
  skip_final_snapshot        = var.skip_final_snapshot
  final_snapshot_identifier  = var.skip_final_snapshot ? null : "${var.name}-final"
  apply_immediately          = true

  tags = { Name = "${var.name}-pg" }
}

# Connection details as a Secrets Manager secret the Docker host reads at deploy.
resource "aws_secretsmanager_secret" "db" {
  name        = "${var.project}/${var.environment}/database"
  description = "NordStern RDS connection — host/user/password + DATABASE_URL base."
}

resource "aws_secretsmanager_secret_version" "db" {
  secret_id = aws_secretsmanager_secret.db.id
  secret_string = jsonencode({
    DB_HOST         = aws_db_instance.this.address
    DB_PORT         = tostring(aws_db_instance.this.port)
    DB_USER         = var.username
    DB_PASSWORD     = var.password
    DB_INITIAL_NAME = var.db_name
    # Append the target database (platformdb / controldb / aggregatordb / anchordb_<slug>).
    DATABASE_URL_BASE = "postgresql://${var.username}:${var.password}@${aws_db_instance.this.address}:${aws_db_instance.this.port}"
  })
}
