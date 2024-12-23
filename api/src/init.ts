import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './modules/user/user.service';
import { CreateUserDto } from './modules/user/dtos/in/create-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AppInit implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Verify if there are users in the database
    const existingUser = await this.userService.exist();

    if (existingUser) {
      return;
    }

    const defaultUser = {
      name:
        this.configService.get<string>('DEFAULT_USER_USERNAME') || 'tickhawk',
      password:
        this.configService.get<string>('DEFAULT_USER_PASSWORD') || 'tickhawk',
      email:
        this.configService.get<string>('DEFAULT_USER_EMAIL') ||
        'admin@tickhawk.com',
      role: 'admin',
    };

    // Create a default user
    const user = plainToInstance(CreateUserDto, defaultUser);
    await this.userService.create(user);
  }
}
