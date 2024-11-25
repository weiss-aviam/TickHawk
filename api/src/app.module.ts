import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketModule } from './modules/ticket/ticket.module';
import { DepartmentModule } from './modules/department/department.module';
import { UserModule } from './user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database'),
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('email.host'),
          port: configService.get<number>('email.port'),
          secure: configService.get<boolean>('email.secure'), // true for SMTPS
          auth: {
            user: configService.get<string>('email.auth.user'),
            pass: configService.get<string>('email.auth.pass'),
          },
        },
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30m' },
      }),
    }),
    AuthModule,
    CompanyModule,
    TicketModule,
    UserModule,
    DepartmentModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [JwtService],
  exports: [JwtModule],
})
export class AppModule {}
