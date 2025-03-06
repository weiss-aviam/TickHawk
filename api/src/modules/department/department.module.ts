import { Global, Module, ValidationPipe } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Department, DepartmentSchema } from './schemas/department.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';

@Global()
@Module({
  providers: [
    DepartmentService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  controllers: [DepartmentController],
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30m' },
      }),
    }),
  ],
  exports: [DepartmentService],
})
export class DepartmentModule {}
