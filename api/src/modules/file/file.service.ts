import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './schemas/file.schema';
import { Express } from 'express';
import { FileDto } from './dtos/out/file.dto';
import { plainToInstance } from 'class-transformer';
import { S3ProviderFactory } from './providers/s3/s3-provider.factory';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<File>,
    private readonly s3ProviderFactory: S3ProviderFactory,
  ) {}

  /**
   * Save a file to the storage provider and database
   * @param file  The file to save
   * @param userId The ID of the user uploading the file
   * @param path Path prefix for the file (optional)
   * @param id Optional ID to use for the file
   * @returns The file DTO
   */
  async saveFile(
    file: Express.Multer.File,
    userId: string,
    path: string = null,
    id: string = null,
  ): Promise<FileDto> {
    try {
      this.logger.debug(`Saving file for user ${userId}, original name: ${file.originalname}`);
      
      const objectId = id ? id : new Types.ObjectId();

      // Check size < 5MB
      if (file.size > 5 * 1024 * 1024) {
        this.logger.warn(`File size too large: ${file.size} bytes`);
        throw new HttpException('FILE_SIZE_TOO_LARGE', 400);
      }

      // Check if the name is too long and shorten it if necessary
      let fileName = file.originalname;
      if (fileName.length > 25) {
        this.logger.debug(`Shortening long filename from ${fileName.length} chars`);
        fileName =
          fileName.substring(0, 25) +
          file.originalname.substring(file.originalname.lastIndexOf('.'));
      }

      // Upload the file to the storage provider
      this.logger.debug(`Uploading file to storage provider: ${objectId.toString()}-${fileName}`);
      const uploadResult = await this.s3ProviderFactory.getProvider().uploadFile(
        file.buffer,
        `${objectId.toString()}-${fileName}`,
        file.mimetype,
        file.size
      );

      // Check if the file is already in the database
      const existingFile = await this.fileModel.findOne({ _id: objectId });
      if (existingFile) {
        this.logger.debug(`File with ID ${objectId} already exists, checking storage`);
        try {
          // Try to get the old file to verify it exists
          await this.s3ProviderFactory.getProvider().getFile(existingFile);
          // If exists, we could delete it here if desired
        } catch (error) {
          this.logger.warn(`Previous file not found in storage: ${error.message}`);
          // Old file not found, continue with the new one
        }
      }

      // Store file metadata in database
      this.logger.debug(`Storing file metadata in database: ${objectId}`);
      const fileObject = await this.fileModel.findOneAndUpdate(
        { _id: objectId },
        {
          _id: objectId,
          name: fileName,
          file: uploadResult.fileIdentifier, // Use the path from the storage provider
          path: uploadResult.path,
          mimetype: file.mimetype,
          size: file.size,
          status: 'temporal',
          userId: userId,
        },
        {
          new: true,
          upsert: true, // Make this update into an upsert
        },
      );

      this.logger.debug(`File saved successfully with ID: ${fileObject._id}`);
      return plainToInstance(FileDto, fileObject.toJSON(), {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error(`Error saving file: ${error.message}`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('FILE_SAVE_FAILED', 500);
    }
  }

  /**
   * Get a file from the storage provider
   * @param id The id of the file
   * @returns The file buffer
   */
  async getFile(id: string): Promise<Buffer> {
    try {
      this.logger.debug(`Retrieving file with ID: ${id}`);
      
      const file = await this.fileModel.findById(id);
      if (!file) {
        this.logger.warn(`File not found in database: ${id}`);
        throw new HttpException('FILE_NOT_FOUND', 404);
      }

      try {
        this.logger.debug(`Requesting file from storage provider: ${file.file}`);
        return await this.s3ProviderFactory.getProvider().getFile(file);
      } catch (error) {
        this.logger.error(`Storage provider error: ${error.message}`, error.stack);
        throw new HttpException('FILE_NOT_FOUND', 404);
      }
    } catch (error) {
      this.logger.error(`Error retrieving file ${id}: ${error.message}`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('FILE_RETRIEVAL_FAILED', 500);
    }
  }

  /**
   * Get a public file from the storage provider
   * @param id The id of the file
   * @returns The file buffer
   */
  async getPublicFile(id: string): Promise<Buffer> {
    try {
      this.logger.debug(`Retrieving public file with ID: ${id}`);
      
      const file = await this.fileModel.findById(id);
      if (!file) {
        this.logger.warn(`Public file not found in database: ${id}`);
        throw new HttpException('FILE_NOT_FOUND', 404);
      }
      
      if (!file.path.includes('public')) {
        this.logger.warn(`File ${id} is not marked as public`);
        throw new HttpException('FILE_NOT_PUBLIC', 403);
      }
      
      try {
        this.logger.debug(`Requesting public file from storage provider: ${file.file}`);
        return await this.s3ProviderFactory.getProvider().getFile(file);
      } catch (error) {
        this.logger.error(`Storage provider error: ${error.message}`, error.stack);
        throw new HttpException('FILE_NOT_FOUND', 404);
      }
    } catch (error) {
      this.logger.error(`Error retrieving public file ${id}: ${error.message}`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('FILE_RETRIEVAL_FAILED', 500);
    }
  }

  /**
   * Get all files
   * @param ids Array of file IDs
   * @returns Array of file DTOs
   */
  async getFiles(ids: string[]): Promise<FileDto[]> {
    try {
      this.logger.debug(`Retrieving ${ids.length} files by IDs`);
      
      if (ids.length === 0) {
        this.logger.debug('Empty file IDs array provided, returning empty result');
        return [];
      }
      
      const files = await this.fileModel.find({
        _id: { $in: ids },
      });
      
      this.logger.debug(`Found ${files.length} of ${ids.length} requested files`);
      
      return files.map((file) =>
        plainToInstance(FileDto, file.toJSON(), {
          excludeExtraneousValues: true,
        }),
      );
    } catch (error) {
      this.logger.error(`Error retrieving files: ${error.message}`, error.stack);
      throw new HttpException('FILE_RETRIEVAL_FAILED', 500);
    }
  }

  /**
   * Mark files as active in the database
   * @param ids The ids of the files to mark as active
   * @param session Optional database session
   */
  async activeFiles(ids: string[], session?: any) {
    try {
      this.logger.debug(`Marking ${ids.length} files as active`);
      
      if (ids.length === 0) {
        this.logger.debug('Empty file IDs array provided, skipping update');
        return;
      }
      
      const sessionOption = session ? { session } : {};
      const result = await this.fileModel.updateMany(
        { _id: { $in: ids } },
        { status: 'active' },
        sessionOption
      );
      
      this.logger.debug(`Activated ${result.modifiedCount} of ${ids.length} files`);
    } catch (error) {
      this.logger.error(`Error activating files: ${error.message}`, error.stack);
      throw new HttpException('FILE_ACTIVATION_FAILED', 500);
    }
  }
}
