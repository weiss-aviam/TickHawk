import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { Roles } from 'src/config/guard/roles/roles.decorator';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';
import { Request } from 'express';
import { UserService } from './user.service';
import { ProfileDto } from './dtos/profile.dto';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';

@Controller('user')
@UseGuards(JWTGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @Roles(['customer', 'admin', 'agent'])
  async getMe(@Req() request: Request) {
    const userData = request.user;
    const id = new Types.ObjectId(userData.id as string);
    const user = await this.userService.findById(id);
    return plainToInstance(ProfileDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
