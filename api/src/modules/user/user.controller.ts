import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { Roles } from 'src/config/guard/roles/roles.decorator';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';
import { Request } from 'express';
import { UserService } from './user.service';
import { Types } from 'mongoose';
import { AssignDepartmentDto } from './dtos/in/assign-department.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProfileDto } from './dtos/out/profile.dto';

@Controller('user')
@UseGuards(JWTGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get user data by id
   * @param request 
   * @returns 
   */
  @Get('/me')
  @Roles(['customer', 'admin', 'agent'])
  @ApiOperation({ summary: 'Get user data by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User data retrieved successfully', type: ProfileDto })
  async getMe(@Req() request: Request): Promise<ProfileDto> {
    const userData = request.user;
    const id = new Types.ObjectId(userData.id as string);
    return await this.userService.findById(id);
  }

  /**
   * Assign department to user by id
   * @param assignDepartmentDto 
   * @returns 
   */
  @Post('/assign-department')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Assign department to user by id' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Department assigned successfully' })
  async assign(@Body() assignDepartmentDto: AssignDepartmentDto) {
    await this.userService.assignDepartment(assignDepartmentDto);
    return HttpStatus.CREATED;
  }
}
