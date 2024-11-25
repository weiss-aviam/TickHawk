import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MongooseModule } from '@nestjs/mongoose';
import {File, FileSchema} from './schemas/file.schema';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
})
export class FileModule {}
