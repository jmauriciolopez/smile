output "s3_bucket_name" {
  value = aws_s3_bucket.frontend_bucket.id
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.s3_distribution.domain_name
}

output "cloudfront_arn" {
  value = aws_cloudfront_distribution.s3_distribution.arn
}

output "website_endpoint" {
  value = aws_s3_bucket_website_configuration.frontend_web.website_endpoint
}
