import { Global, Module, ValidationPipe } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company, CompanySchema } from './schemas/company.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_PIPE } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from '../user/schemas/user.schema';

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
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
