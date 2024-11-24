import { Body, Controller, Get, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { Roles } from 'src/config/guard/roles/roles.decorator';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';
import { Request } from 'express';
import { UserService } from './user.service';
import { Types } from 'mongoose';
import { AssignDepartmentDto } from './dtos/assign-department.dto';

@Controller('user')
@UseGuards(JWTGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @Roles(['customer', 'admin', 'agent'])
  async getMe(@Req() request: Request) {
    const userData = request.user;
    const id = new Types.ObjectId(userData.id as string);
    return await this.userService.findById(id);
  }

  
  @Post('/assign-department')
  @Roles(['admin'])
  async assign(@Body() assignDepartmentDto: AssignDepartmentDto) {
      await this.userService.assignDepartment(assignDepartmentDto);
      return HttpStatus.CREATED;
  }
}
