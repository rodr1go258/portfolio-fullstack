variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "portfolio"
}

variable "aws_region" {
  description = "Región de AWS"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "Tipo de instancia de la VM"
  type        = string
  default     = "t3.micro"
}

variable "ssh_allowed_cidr" {
  description = "CIDR permitido para SSH"
  type        = string
  default     = "0.0.0.0/0"
}

variable "key_name" {
  description = "Nombre del par de llaves en AWS"
  type        = string
  default     = "portfolio-key"
}

variable "ssh_public_key" {
  description = "Llave pública SSH"
  type        = string
  sensitive   = true
}

variable "cloudflare_api_token" {
  description = "Token de la API de Cloudflare"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Zone ID de Cloudflare"
  type        = string
}

variable "domain_name" {
  description = "Dominio o subdominio del portafolio"
  type        = string
}
