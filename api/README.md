# 🦅 TickHawk API

Welcome to **TickHawk API**, the backend for the TickHawk ticket management system built with NestJS and MongoDB.

## 🚀 Features

- **Authentication** - JWT-based auth with access and refresh tokens
- **Company Management** - Create and manage multiple companies
- **Department Organization** - Organize teams within companies
- **Ticket System** - Complete ticket lifecycle management
- **File Management** - Support for multiple storage providers
- **User Management** - Role-based access control

## 🔧 Installation

```bash
# Install dependencies
npm install

# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## 🐳 Docker

```bash
# Build and run with Docker
docker build -t tickhawk-api .
docker run -p 3000:3000 tickhawk-api

# Or use Docker Compose from the root directory
docker compose up api
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tickhawk

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Default Admin User
DEFAULT_USER_USERNAME=admin
DEFAULT_USER_PASSWORD=tickhawk_admin
DEFAULT_USER_EMAIL=admin@tickhawk.com

# Storage Configuration
S3_PROVIDER=local  # Options: local, aws, minio, ovh
LOCAL_UPLOAD_PATH=/path/to/uploads

# AWS S3 Configuration (only needed if S3_PROVIDER=aws)
# AWS_S3_BUCKET_NAME=your-bucket-name
# AWS_S3_REGION=your-aws-region
# AWS_S3_ACCESS_KEY=your-aws-access-key
# AWS_S3_SECRET_KEY=your-aws-secret-key

# Minio Configuration (only needed if S3_PROVIDER=minio)
# MINIO_BUCKET_NAME=your-minio-bucket
# MINIO_ENDPOINT=your-minio-endpoint
# MINIO_PORT=9000
# MINIO_USE_SSL=false
# MINIO_ACCESS_KEY=your-minio-access-key
# MINIO_SECRET_KEY=your-minio-secret-key
# MINIO_REGION=us-east-1

# OVH Object Storage Configuration (only needed if S3_PROVIDER=ovh)
# OVH_S3_BUCKET_NAME=your-ovh-bucket
# OVH_S3_ENDPOINT=s3.your-region.cloud.ovh.net
# OVH_S3_PORT=443
# OVH_S3_ACCESS_KEY=your-ovh-access-key
# OVH_S3_SECRET_KEY=your-ovh-secret-key
# OVH_S3_REGION=GRA # Your region (GRA, SBG, etc)
```

## 📁 API Modules

- **Auth** - Authentication and token management
- **Company** - Company and contract management
- **Department** - Department organization
- **File** - File storage and retrieval
- **Ticket** - Ticket management with comments
- **User** - User management and profiles

## 📚 Storage Providers

TickHawk supports multiple storage providers for file uploads:

1. **Local Storage** (default): Files are stored on the local filesystem
2. **AWS S3**: Files are stored in an Amazon S3 bucket
3. **MinIO**: Files are stored in a MinIO server
4. **OVH Object Storage**: Files are stored in OVH's Object Storage service (compatible with S3)

To configure the storage provider, set the `S3_PROVIDER` environment variable to one of: `local`, `aws`, `minio`, or `ovh`, and then set the appropriate provider-specific environment variables as listed above.