import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company, CompanySchema } from './schemas/company.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }], 'companies'),
  ],
})
export class CompaniesModule {}
