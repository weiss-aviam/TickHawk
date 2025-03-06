import { Injectable } from '@nestjs/common';
import { S3ProviderInterface } from './s3-provider.interface';
import { File } from '../../schemas/file.schema';
import { join } from 'path';
import { promises } from 'fs';

@Injectable()
export class LocalProvider implements S3ProviderInterface {
  private readonly uploadPath: string;
  
  constructor() {
    this.uploadPath = process.env.LOCAL_UPLOAD_PATH || 
      join(__dirname, '..', '..', '..', '..', '..', 'uploads');
  }

  async uploadFile(
    buffer: Buffer, 
    fileName: string, 
    mimetype: string, 
    size: number
  ): Promise<{ path: string; fileIdentifier: string }> {
    // Create a folder for the current year and month
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const path = join(this.uploadPath, year.toString(), month);
    
    // Generate a unique file identifier
    const fileId = `${Date.now()}-${fileName}`;
    const filePath = join(path, fileId);
    
    // Create directory if it doesn't exist
    await promises.mkdir(path, { recursive: true });
    
    // Write file to disk
    await promises.writeFile(filePath, buffer);
    
    return {
      path: path,
      fileIdentifier: fileId
    };
  }

  async getFile(file: File): Promise<Buffer> {
    try {
      const filePath = join(file.path, file.file);
      return await promises.readFile(filePath);
    } catch (error) {
      throw new Error('ERROR_FILE_NOT_FOUND');
    }
  }

  async deleteFile(file: File): Promise<void> {
    try {
      const filePath = join(file.path, file.file);
      await promises.unlink(filePath);
    } catch (error) {
      throw new Error('ERROR_FILE_NOT_FOUND');
    }
  }
}