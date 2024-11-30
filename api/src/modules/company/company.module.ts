import { Global, Module, ValidationPipe } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company, CompanySchema } from './schemas/company.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_PIPE } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  controllers: [CompanyController],
  providers: [
    CompanyService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    JwtService,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
    ]),
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
