import { Global, Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MongooseModule } from '@nestjs/mongoose';
import {File, FileSchema} from './schemas/file.schema';

@Global()
@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  exports: [FileService],
})
export class FileModule {}
