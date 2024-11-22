import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schemas/token.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AgentModule } from 'src/agent/agent.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret:  configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30m' },
      }),
    }),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    AgentModule,
    CustomerModule,
  ],
})
export class AuthModule {
  
}
