import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Express } from 'express';
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
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<FileDto> {
    const userId = req.user.id;
    return await this.fileService.saveFile(file, userId, 'ticket');
  }
}
