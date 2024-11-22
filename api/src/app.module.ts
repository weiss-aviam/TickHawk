import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketModule } from './ticket/ticket.module';
import { DepartmentModule } from './department/department.module';
import { JwtMiddleware } from './config/jwt.middleware';
import { UserModule } from './user/user.module';
import { JwtService } from '@nestjs/jwt';

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
    UserModule,
    DepartmentModule
  ],
  controllers: [AppController],
  providers: [JwtService],
  
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).exclude(
      { path: 'auth/(.*)', method: RequestMethod.ALL },
    )
    .forRoutes('*');
  }
}
