import { Injectable, Logger } from '@nestjs/common';
import { 
  BadRequestException, 
  ConflictException,
  ForbiddenException,
  InternalServerException, 
  NotFoundException 
} from 'src/common/exceptions';
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
        throw new BadRequestException('File size too large (max 5MB)', 'FILE_SIZE_TOO_LARGE');
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
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerException('Failed to save file', 'FILE_SAVE_FAILED');
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
        throw new NotFoundException('File not found', 'FILE_NOT_FOUND');
      }

      try {
        this.logger.debug(`Requesting file from storage provider: ${file.file}`);
        return await this.s3ProviderFactory.getProvider().getFile(file);
      } catch (error) {
        this.logger.error(`Storage provider error: ${error.message}`, error.stack);
        throw new NotFoundException('File not found in storage', 'FILE_STORAGE_NOT_FOUND');
      }
    } catch (error) {
      this.logger.error(`Error retrieving file ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerException('Failed to retrieve file', 'FILE_RETRIEVAL_FAILED');
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
        throw new NotFoundException('Public file not found', 'FILE_NOT_FOUND');
      }
      
      if (!file.path.includes('public')) {
        this.logger.warn(`File ${id} is not marked as public`);
        throw new ForbiddenException('File is not public', 'FILE_NOT_PUBLIC');
      }
      
      try {
        this.logger.debug(`Requesting public file from storage provider: ${file.file}`);
        return await this.s3ProviderFactory.getProvider().getFile(file);
      } catch (error) {
        this.logger.error(`Storage provider error: ${error.message}`, error.stack);
        throw new NotFoundException('Public file not found in storage', 'FILE_STORAGE_NOT_FOUND');
      }
    } catch (error) {
      this.logger.error(`Error retrieving public file ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerException('Failed to retrieve public file', 'FILE_RETRIEVAL_FAILED');
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
      throw new InternalServerException('Failed to retrieve files', 'FILE_RETRIEVAL_FAILED');
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
      throw new InternalServerException('Failed to activate files', 'FILE_ACTIVATION_FAILED');
    }
  }
  
  /**
   * Remove a file from the storage provider and database
   * @param id The ID of the file to remove
   * @returns Boolean indicating success
   */
  async removeFile(id: string): Promise<boolean> {
    try {
      this.logger.debug(`Removing file with ID: ${id}`);
      
      // Find the file first
      const file = await this.fileModel.findById(id);
      if (!file) {
        this.logger.warn(`File not found in database for removal: ${id}`);
        return false;
      }
      
      try {
        // Delete from storage provider
        this.logger.debug(`Deleting file from storage provider: ${file.file}`);
        await this.s3ProviderFactory.getProvider().deleteFile(file);
      } catch (error) {
        this.logger.error(`Error deleting file from storage: ${error.message}`, error.stack);
        // Continue with deletion from database even if storage deletion fails
      }
      
      // Delete from database
      const result = await this.fileModel.deleteOne({ _id: id });
      const success = result.deletedCount > 0;
      
      if (success) {
        this.logger.debug(`File with ID: ${id} successfully removed`);
      } else {
        this.logger.warn(`File with ID: ${id} not found for deletion from database`);
      }
      
      return success;
    } catch (error) {
      this.logger.error(`Error removing file ${id}: ${error.message}`, error.stack);
      throw new InternalServerException('Failed to remove file', 'FILE_REMOVAL_FAILED');
    }
  }

  /**
   * Check if a file exists in the database and storage
   * @param id The ID of the file to check
   * @returns Boolean indicating if the file exists
   */
  async fileExists(id: string): Promise<boolean> {
    try {
      if (!id) {
        this.logger.debug('Null or undefined file ID passed to fileExists');
        return false;
      }
      
      this.logger.debug(`Checking if file exists with ID: ${id}`);
      
      // Check if the ID is a valid ObjectId
      if (!Types.ObjectId.isValid(id)) {
        this.logger.debug(`Invalid ObjectId format: ${id}`);
        return false;
      }
      
      // Find the file in the database
      const file = await this.fileModel.findById(id);
      const exists = file !== null;
      
      this.logger.debug(`File existence check for ${id}: ${exists}`);
      
      if (exists) {
        // Optionally check if the file exists in storage too
        try {
          await this.s3ProviderFactory.getProvider().getFile(file);
          this.logger.debug(`File ${id} exists in both database and storage`);
          return true;
        } catch (storageError) {
          this.logger.warn(`File ${id} exists in database but not in storage: ${storageError.message}`);
          // Return true even if file doesn't exist in storage but exists in DB
          return true;
        }
      }
      
      return false;
    } catch (error) {
      this.logger.error(`Error checking if file exists: ${error.message}`, error.stack);
      return false; // Return false instead of throwing an exception for better error handling
    }
  }
}
