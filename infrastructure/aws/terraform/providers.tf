provider "aws" {
  region = var.aws_region

  # Every resource inherits these tags — makes the pilot easy to find and tear down.
  default_tags {
    tags = {
      Project     = var.project
      Environment = var.environment
      ManagedBy   = "terraform"
      Stack       = "pilot-single-ec2"
    }
  }
}
