import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
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
import { Public } from 'src/config/public.decorator';

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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User data retrieved successfully',
    type: ProfileDto,
  })
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Department assigned successfully',
  })
  async assign(@Body() assignDepartmentDto: AssignDepartmentDto) {
    await this.userService.assignDepartment(assignDepartmentDto);
    return HttpStatus.CREATED;
  }

  /**
   * Get profile image by id
   * @param request
   * @returns
   */
  @Get('/profile/image/:id')
  @Public()
  @ApiOperation({ summary: 'Get profile image by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile image retrieved successfully',
  })
  async getImage(@Param('id') id: string, @Res() res) {
    // Return image base64 string and headers, image base default hardcoded
    const image =
      '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';
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(Buffer.from(image, 'base64'));
  }
}
