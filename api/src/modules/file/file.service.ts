import { HttpException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { promises } from 'fs';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './schemas/file.schema';
import { Express } from 'express';
import { Multer } from 'multer';
import { FileDto } from './dtos/out/file.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FileService {
  private readonly uploadPath = join(__dirname, '..', '..', '..', 'uploads');

  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<File>,
  ) {}

  /**
   * Save a file to the file system and database
   * @param file  The file to save
   * @param path  The path to save the file to
   * @returns    The id of the file
   */
  async saveFile(file: Express.Multer.File, userId: string, path: string = null): Promise<FileDto> {
    const objectId = new Types.ObjectId();

    // Check size < 3MB
    if (file.size > 3 * 1024 * 1024) {
      throw new HttpException('FILE_SIZE_TOO_LARGE', 400);
    }

    if (!path) {
      path = this.uploadPath;
    } else {
      path = join(this.uploadPath, path);
    }

    // Create a folder for the current year and month
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0')
    path = join(path, year.toString(), month);

    const filePath = join(path, objectId.toString());
    await promises.mkdir(path, { recursive: true });
    await promises.writeFile(filePath, file.buffer);

    // Check if the name is too long and shorten it if necessary
    var fileName = file.originalname;
    if (fileName.length > 25) {
      fileName = fileName.substring(0, 25) + file.originalname.substring(file.originalname.lastIndexOf('.'));
    }

    const fileObject = await this.fileModel.create({
      name: fileName,
      file: objectId.toString(),
      path: path,
      mimetype: file.mimetype,
      size: file.size,
      status: 'temporal',
      userId: userId,
    });

    return plainToInstance(FileDto, fileObject.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Get a file from the file system
   * @param id The id of the file
   * @returns 
   */
  async getFile(id: string): Promise<Buffer> {
    const file = await this.fileModel.findById(id);
    if (!file) {
        throw new Error('ERROR_FILE_NOT_FOUND');
    }

    // check if the file is exist
    try{
      await promises.access(join(file.path, file.file.toString()));
    } catch (error) {
      throw new Error('ERROR_FILE_NOT_FOUND');
    }
    return await promises.readFile(join(file.path, file.file.toString()));
  }

  /**
   * Get a public file from the file system
   * @param id The id of the file
   * @returns 
   */
  async getPublicFile(id: string): Promise<Buffer> {
    const file = await this.fileModel.findById(id);
    if (!file || !file.path.startsWith(join(this.uploadPath, 'public'))) {
        throw new Error('ERROR_FILE_NOT_FOUND');
    }
    return await promises.readFile(join(file.path, file.file.toString()));
  }

  /**
   * Get all files
   * @returns 
   */
  async getFiles(ids: string[]): Promise<FileDto[]> {
    const files = await this.fileModel.find({
      _id: { $in: ids },
    });
    return files.map(file => plainToInstance(FileDto, file.toJSON(), {
      excludeExtraneousValues: true,
    }));
  }

  /**
   * Delete a file from the file system and database
   * @param ids The ids of the files to delete
   */
  async activeFiles(ids: string[], session?: any) {
    const sessionOption = session ? { session } : {};
    await this.fileModel.updateMany(
      { _id: { $in: ids } },
      { status: 'active' },
    ), sessionOption;
  }
  
}
