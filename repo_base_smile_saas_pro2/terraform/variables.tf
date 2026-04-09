variable "aws_region" {
  description = "Región de AWS para desplegar el frontend"
  type        = string
  default     = "sa-east-1"
}

variable "environment" {
  description = "Entorno de despliegue (produccion/staging)"
  type        = string
  default     = "produccion"
}

variable "domain_name" {
  description = "Nombre de dominio solicitado"
  type        = string
  default     = "smile.criterioingenieria.online"
}
