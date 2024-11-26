import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CompanyModule } from './modules/company/company.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { DepartmentModule } from './modules/department/department.module';
import { FileModule } from './modules/file/file.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ShareModule } from './config/share.module';

@Module({
  imports: [
    ShareModule,
    AuthModule,
    CompanyModule,
    TicketModule,
    UserModule,
    DepartmentModule,
    FileModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

//TODO: Catch error 500 and return a custom message