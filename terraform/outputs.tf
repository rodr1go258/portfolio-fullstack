output "public_ip" {
  description = "IP pública de la VM"
  value       = aws_instance.portfolio.public_ip
}

output "domain" {
  description = "Dominio configurado en Cloudflare"
  value       = "https://${var.domain_name}"
}
