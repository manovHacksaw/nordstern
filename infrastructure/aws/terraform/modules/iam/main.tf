# EC2 instance role — least privilege. The Docker host may:
#   • read the platform + database secrets it needs to boot;
#   • create/read/update the per-anchor PSP secrets the control-plane manages at
#     <secrets_prefix>/<secrets_env>/anchor/<slug> (matches the app's secretPathFor);
#   • write its container logs to the project's CloudWatch log groups;
#   • be reached via SSM Session Manager (no inbound SSH).
# Nothing broader.

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_partition" "current" {}

locals {
  platform_secrets_arn = "arn:${data.aws_partition.current.partition}:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.project}/${var.environment}/*"
  anchor_secrets_arn   = "arn:${data.aws_partition.current.partition}:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.secrets_prefix}/${var.secrets_env}/anchor/*"
  log_groups_arn       = "arn:${data.aws_partition.current.partition}:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/${var.project}/${var.environment}/*"
}

data "aws_iam_policy_document" "assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ec2" {
  name               = "${var.name}-ec2"
  assume_role_policy = data.aws_iam_policy_document.assume.json
}

data "aws_iam_policy_document" "app" {
  # Read the platform + database secrets to boot.
  statement {
    sid       = "ReadPlatformSecrets"
    actions   = ["secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret"]
    resources = [local.platform_secrets_arn]
  }

  # Manage per-anchor PSP/banking secrets (the control-plane creates these on redeem).
  statement {
    sid = "ManageAnchorSecrets"
    actions = [
      "secretsmanager:CreateSecret",
      "secretsmanager:PutSecretValue",
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
      "secretsmanager:TagResource",
      "secretsmanager:UpdateSecret",
    ]
    resources = [local.anchor_secrets_arn]
  }

  # Ship container logs.
  statement {
    sid = "WriteLogs"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
    ]
    resources = [local.log_groups_arn]
  }
}

resource "aws_iam_role_policy" "app" {
  name   = "${var.name}-app"
  role   = aws_iam_role.ec2.id
  policy = data.aws_iam_policy_document.app.json
}

# SSM Session Manager — keyless shell access, the least-privilege alternative to SSH.
resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${var.name}-ec2"
  role = aws_iam_role.ec2.name
}
