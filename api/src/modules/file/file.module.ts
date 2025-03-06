import { Global, Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas/file.schema';
import { S3ProviderFactory } from './providers/s3/s3-provider.factory';

@Global()
@Module({
  controllers: [FileController],
  providers: [
    FileService,
    S3ProviderFactory
  ],
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  exports: [FileService],
})
export class FileModule {}
