# The single Docker host that runs the entire stack + every provisioned anchor.
# user_data preps the box (Docker, compose, git, CloudWatch agent) but deliberately
# does NOT deploy the app — that is a reviewed manual step (see README) so nothing
# money-moving comes up unattended.

data "aws_ami" "al2023" {
  count       = var.ami_id == "" ? 1 : 0
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

locals {
  ami_id = var.ami_id != "" ? var.ami_id : data.aws_ami.al2023[0].id
}

resource "aws_cloudwatch_log_group" "platform" {
  name              = "/${var.project}/${var.environment}/platform"
  retention_in_days = var.log_retention_days
}

resource "aws_cloudwatch_log_group" "anchors" {
  name              = "/${var.project}/${var.environment}/anchors"
  retention_in_days = var.log_retention_days
}

resource "aws_instance" "this" {
  ami                    = local.ami_id
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  iam_instance_profile   = var.instance_profile
  key_name               = var.key_name != "" ? var.key_name : null

  root_block_device {
    volume_size = var.root_volume_gb
    volume_type = "gp3"
    encrypted   = true
  }

  metadata_options {
    http_tokens   = "required" # IMDSv2 only
    http_endpoint = "enabled"
  }

  user_data = <<-EOF
    #!/bin/bash
    set -euxo pipefail
    dnf update -y
    dnf install -y docker git amazon-cloudwatch-agent
    systemctl enable --now docker
    usermod -aG docker ec2-user
    # Docker Compose v2 plugin
    mkdir -p /usr/libexec/docker/cli-plugins
    curl -sSL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
      -o /usr/libexec/docker/cli-plugins/docker-compose
    chmod +x /usr/libexec/docker/cli-plugins/docker-compose
    echo "NordStern host ready. Deploy the stack per deploy/terraform/README.md." > /etc/motd
  EOF

  tags = { Name = "${var.name}-host" }
}

resource "aws_eip" "this" {
  domain   = "vpc"
  instance = aws_instance.this.id
  tags     = { Name = "${var.name}-eip" }
}
