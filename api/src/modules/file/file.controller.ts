import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Get('public/:file')
    async servePublicFile(@Param('file') file: string) {
        const buffer = await this.fileService.getPublicFile(file);
        return new StreamableFile(buffer);
    }
}
