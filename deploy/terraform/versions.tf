terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # State: use a versioned, encrypted S3 backend in any shared/real environment so the
  # generated secrets in state are not sitting on a laptop. Left commented so a first
  # `init` works locally; uncomment + fill before applying for real. See README.
  # backend "s3" {
  #   bucket = "nordstern-tfstate"
  #   key    = "pilot/terraform.tfstate"
  #   region = "ap-northeast-1"
  #   encrypt = true
  # }
}
