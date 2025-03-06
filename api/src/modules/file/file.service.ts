import { HttpException, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './schemas/file.schema';
import { Express } from 'express';
import { FileDto } from './dtos/out/file.dto';
import { plainToInstance } from 'class-transformer';
import { S3ProviderFactory } from './providers/s3/s3-provider.factory';

@Injectable()
export class FileService {
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
    const objectId = id ? id : new Types.ObjectId();

    // Check size < 5MB
    if (file.size > 5 * 1024 * 1024) {
      throw new HttpException('FILE_SIZE_TOO_LARGE', 400);
    }

    // Check if the name is too long and shorten it if necessary
    let fileName = file.originalname;
    if (fileName.length > 25) {
      fileName =
        fileName.substring(0, 25) +
        file.originalname.substring(file.originalname.lastIndexOf('.'));
    }

    // Upload the file to the storage provider
    const uploadResult = await this.s3ProviderFactory.getProvider().uploadFile(
      file.buffer,
      `${objectId.toString()}-${fileName}`,
      file.mimetype,
      file.size
    );

    // Check if the file is already in the database
    const existingFile = await this.fileModel.findOne({ _id: objectId });
    if (existingFile) {
      try {
        // Try to get the old file to verify it exists
        await this.s3ProviderFactory.getProvider().getFile(existingFile);
        // If exists, we could delete it here if desired
      } catch (error) {
        // Old file not found, continue with the new one
      }
    }

    // Store file metadata in database
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

    return plainToInstance(FileDto, fileObject.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Get a file from the storage provider
   * @param id The id of the file
   * @returns The file buffer
   */
  async getFile(id: string): Promise<Buffer> {
    const file = await this.fileModel.findById(id);
    if (!file) {
      throw new Error('ERROR_FILE_NOT_FOUND');
    }

    try {
      return await this.s3ProviderFactory.getProvider().getFile(file);
    } catch (error) {
      throw new Error('ERROR_FILE_NOT_FOUND');
    }
  }

  /**
   * Get a public file from the storage provider
   * @param id The id of the file
   * @returns The file buffer
   */
  async getPublicFile(id: string): Promise<Buffer> {
    const file = await this.fileModel.findById(id);
    if (!file || !file.path.includes('public')) {
      throw new Error('ERROR_FILE_NOT_FOUND');
    }
    
    try {
      return await this.s3ProviderFactory.getProvider().getFile(file);
    } catch (error) {
      throw new Error('ERROR_FILE_NOT_FOUND');
    }
  }

  /**
   * Get all files
   * @param ids Array of file IDs
   * @returns Array of file DTOs
   */
  async getFiles(ids: string[]): Promise<FileDto[]> {
    const files = await this.fileModel.find({
      _id: { $in: ids },
    });
    return files.map((file) =>
      plainToInstance(FileDto, file.toJSON(), {
        excludeExtraneousValues: true,
      }),
    );
  }

  /**
   * Mark files as active in the database
   * @param ids The ids of the files to mark as active
   * @param session Optional database session
   */
  async activeFiles(ids: string[], session?: any) {
    const sessionOption = session ? { session } : {};
    await this.fileModel.updateMany(
      { _id: { $in: ids } },
      { status: 'active' },
    ),
      sessionOption;
  }
}
