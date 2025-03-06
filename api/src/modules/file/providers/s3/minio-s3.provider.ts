import { Injectable } from '@nestjs/common';
import { S3ProviderInterface } from './s3-provider.interface';
import { File } from '../../schemas/file.schema';
import * as Minio from 'minio';

@Injectable()
export class MinioS3Provider implements S3ProviderInterface {
  private minioClient: Minio.Client;
  private bucketName: string;
  
  constructor() {
    this.bucketName = process.env.MINIO_BUCKET_NAME;
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT || '9000', 10),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  async uploadFile(
    buffer: Buffer, 
    fileName: string, 
    mimetype: string, 
    size: number
  ): Promise<{ path: string; fileIdentifier: string }> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const path = `${year}/${month}`;
    const fileId = `${path}/${fileName}`;

    // Check if bucket exists, create if it doesn't
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, process.env.MINIO_REGION || 'us-east-1');
    }

    await this.minioClient.putObject(
      this.bucketName,
      fileId,
      buffer,
      size,
      { 'Content-Type': mimetype }
    );
    
    return {
      path: path,
      fileIdentifier: fileId
    };
  }

  async getFile(file: File): Promise<Buffer> {
    const dataStream = await this.minioClient.getObject(
      this.bucketName,
      file.file
    );
    
    return new Promise((resolve, reject) => {
      const chunks = [];
      dataStream.on('data', (chunk) => chunks.push(chunk));
      dataStream.on('end', () => resolve(Buffer.concat(chunks)));
      dataStream.on('error', (err) => reject(err));
    });
  }

  async deleteFile(file: File): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, file.file);
  }
}