import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';
import { File as FileMulter } from 'multer';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './schemas/file.schema';

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
  async saveFile(file: FileMulter, path: string = null): Promise<string> {
    const objectId = new Types.ObjectId();

    if (!path) {
      path = this.uploadPath;
    } else {
      path = join(this.uploadPath, path);
    }
    const filePath = join(path, objectId.toString());
    await fs.mkdir(this.uploadPath, { recursive: true });
    await fs.writeFile(filePath, file.buffer);

    await this.fileModel.create({
      _id: objectId,
      path: path,
      name: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    return objectId.toString();
  }

  async getFile(id: string): Promise<Buffer> {
    const file = await this.fileModel.findById(id);
    if (!file) {
        throw new Error('File not found');
    }
    return await fs.readFile(join(file.path, file._id.toString()));
  }
}
