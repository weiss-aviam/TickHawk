import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketModule } from './ticket/ticket.module';
import { CustomerModule } from './user/user.module';
import { DepartmentModule } from './department/department.module';
import { JwtMiddleware } from './middleware/jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database'),
      }),
    }),
    AuthModule,
    CompanyModule,
    TicketModule,
    CustomerModule,
    DepartmentModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: import('@nestjs/common').MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).exclude('/auth/*').forRoutes('*')
  }
}
