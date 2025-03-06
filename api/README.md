# 🦅 TickHawk

Welcome to **TickHawk**, a Nestjs app

## Environment

```
# Server Configuration
BASE_URL=http://localhost:4000
MONGO_URI=mongodb://xxxxxxx/yyy

# JWT Configuration
JWT_SECRET=secret
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Email Configuration
EMAIL_HOST=smtp.xxx.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USERNAME=test
EMAIL_PASSWORD=test

# Default User Configuration
DEFAULT_USER_USERNAME=tickhawk
DEFAULT_USER_PASSWORD=tickhawk
DEFAULT_USER_EMAIL=email@email.com

# Storage Configuration
# Type of storage to use (aws, minio, ovh, local)
STORAGE_TYPE=local

# Local Storage Configuration (only needed if STORAGE_TYPE=local)
LOCAL_UPLOAD_PATH=/path/to/uploads

# AWS S3 Configuration (only needed if STORAGE_TYPE=aws)
# AWS_S3_BUCKET_NAME=your-bucket-name
# AWS_S3_REGION=your-aws-region
# AWS_S3_ACCESS_KEY=your-aws-access-key
# AWS_S3_SECRET_KEY=your-aws-secret-key

# Minio Configuration (only needed if STORAGE_TYPE=minio)
# MINIO_BUCKET_NAME=your-minio-bucket
# MINIO_ENDPOINT=your-minio-endpoint
# MINIO_PORT=9000
# MINIO_USE_SSL=false
# MINIO_ACCESS_KEY=your-minio-access-key
# MINIO_SECRET_KEY=your-minio-secret-key
# MINIO_REGION=us-east-1

# OVH Object Storage Configuration (only needed if STORAGE_TYPE=ovh)
# OVH_S3_BUCKET_NAME=your-ovh-bucket
# OVH_S3_ENDPOINT=s3.your-region.cloud.ovh.net
# OVH_S3_PORT=443
# OVH_S3_ACCESS_KEY=your-ovh-access-key
# OVH_S3_SECRET_KEY=your-ovh-secret-key
# OVH_S3_REGION=GRA # Your region (GRA, SBG, etc)
```

## Storage Providers

TickHawk supports multiple storage providers for file uploads:

1. **Local Storage** (default): Files are stored on the local filesystem
2. **AWS S3**: Files are stored in an Amazon S3 bucket
3. **MinIO**: Files are stored in a MinIO server
4. **OVH Object Storage**: Files are stored in OVH's Object Storage service (compatible with S3)

To configure the storage provider, set the `STORAGE_TYPE` environment variable to one of: `local`, `aws`, `minio`, or `ovh`, and then set the appropriate provider-specific environment variables as listed above.

Only the configuration for the selected provider needs to be included in your `.env` file.