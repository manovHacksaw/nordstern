# VPC with public subnets (the EC2 Docker host + Elastic IP) and private subnets
# (RDS — never publicly reachable). No NAT gateway: RDS needs no outbound internet,
# and the pilot avoids the standing NAT cost. Egress for the EC2 host is via the IGW.

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags                 = { Name = "${var.name}-vpc" }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags   = { Name = "${var.name}-igw" }
}

resource "aws_subnet" "public" {
  count                   = var.az_count
  vpc_id                  = aws_vpc.this.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  tags                    = { Name = "${var.name}-public-${count.index}", Tier = "public" }
}

resource "aws_subnet" "private" {
  count             = var.az_count
  vpc_id            = aws_vpc.this.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  tags              = { Name = "${var.name}-private-${count.index}", Tier = "private" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }
  tags = { Name = "${var.name}-public-rt" }
}

resource "aws_route_table_association" "public" {
  count          = var.az_count
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# ─── Security groups (minimum ingress) ───────────────────────────────────────

resource "aws_security_group" "ec2" {
  name        = "${var.name}-ec2"
  description = "Public web + SEP for the Docker host. SSH only if explicitly enabled."
  vpc_id      = aws_vpc.this.id
  tags        = { Name = "${var.name}-ec2" }
}

resource "aws_vpc_security_group_ingress_rule" "web_http" {
  for_each          = toset(var.allowed_web_cidrs)
  security_group_id = aws_security_group.ec2.id
  description       = "HTTP (redirected to HTTPS by Traefik)"
  cidr_ipv4         = each.value
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "web_https" {
  for_each          = toset(var.allowed_web_cidrs)
  security_group_id = aws_security_group.ec2.id
  description       = "HTTPS — console, customer apps, SEP endpoints"
  cidr_ipv4         = each.value
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "ssh" {
  for_each          = var.enable_ssh ? toset(var.allowed_ssh_cidrs) : toset([])
  security_group_id = aws_security_group.ec2.id
  description       = "SSH (prefer SSM Session Manager instead)"
  cidr_ipv4         = each.value
  from_port         = 22
  to_port           = 22
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "ec2_all" {
  security_group_id = aws_security_group.ec2.id
  description       = "All outbound (Docker pulls, Stellar/Horizon, Resend, Secrets Manager, SSM)"
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_security_group" "rds" {
  name        = "${var.name}-rds"
  description = "Postgres reachable only from the Docker host."
  vpc_id      = aws_vpc.this.id
  tags        = { Name = "${var.name}-rds" }
}

resource "aws_vpc_security_group_ingress_rule" "rds_from_ec2" {
  security_group_id            = aws_security_group.rds.id
  description                  = "Postgres from the EC2 security group only"
  referenced_security_group_id = aws_security_group.ec2.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
}
