import { Controller, Get, Param, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Multer } from 'multer';
import { FileDto } from './dtos/out/file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * Serve a public file from the file system
   * @param file
   * @returns
   */
  @Get('public/:file')
  async servePublicFile(@Param('file') file: string) {
    const buffer = await this.fileService.getPublicFile(file);
    return new StreamableFile(buffer);
  }

  /**
   * Upload a file to the server
   */
  @Post('ticket')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileDto> {
    return await this.fileService.saveFile(file, 'ticket');
  }
}
