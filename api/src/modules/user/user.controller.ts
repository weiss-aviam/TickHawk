import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { Roles } from 'src/config/guard/roles/roles.decorator';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';
import { Request } from 'express';
import { UserService } from './user.service';
import { Types } from 'mongoose';
import { AssignDepartmentDto } from './dtos/in/assign-department.dto';
import { ApiConsumes, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ProfileDto } from './dtos/out/profile.dto';
import { Public } from 'src/config/public.decorator';
import { UpdateProfileDto } from './dtos/in/update-profile.dto';
import { FileService } from '../file/file.service';
import { UserListDto } from './dtos/out/user-list.dto';
import { AssignCompanyDto } from './dtos/in/assign-company.dto';
import { CreateUserDto } from './dtos/in/create-user.dto';

@Controller('user')
@UseGuards(JWTGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

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

  @Put('/me')
  @Roles(['customer', 'admin', 'agent'])
  @ApiOperation({ summary: 'Update user data by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User data updated successfully',
    type: ProfileDto,
  })
  async updateMe(
    @Req() request: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    return await this.userService.update(updateProfileDto);
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
   * Assign company to user by id (only for customer users)
   * @param assignCompanyDto
   * @returns
   */
  @Post('/assign-company')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Assign company to user by id (only for customer users)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company assigned successfully',
    type: ProfileDto,
  })
  async assignCompany(@Body() assignCompanyDto: AssignCompanyDto): Promise<ProfileDto> {
    return await this.userService.assignCompany(assignCompanyDto);
  }
  
  /**
   * Create a new user (admin only)
   * @param createUserDto
   * @returns
   */
  @Post()
  @Roles(['admin'])
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: ProfileDto,
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<ProfileDto> {
    return await this.userService.createUser(createUserDto);
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
    try {
      const buffer = await this.fileService.getFile(id);
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(buffer);
    } catch (e) {
      const image =
        '';
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(Buffer.from(image, 'base64'));
    }
  }

  /**
   * Get all users with pagination and filtering
   * @param page
   * @param limit
   * @param search
   * @param role
   * @returns
   */
  @Get()
  @Roles(['admin'])
  @ApiOperation({ summary: 'Get all users with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users retrieved successfully',
    type: UserListDto,
  })
  async getAllUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ): Promise<UserListDto> {
    return await this.userService.findAll({
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      search,
      role,
    });
  }
  
  /**
   * Get a user by ID (admin only)
   * @param id User ID
   * @returns User profile data
   */
  @Get('/:id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Get a user by ID (admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User data retrieved successfully',
    type: ProfileDto,
  })
  async getUserById(@Param('id') id: string): Promise<ProfileDto> {
    return await this.userService.findById(new Types.ObjectId(id));
  }
  
  /**
   * Update a user by ID (admin only)
   * @param id User ID
   * @param updateProfileDto Update profile data
   * @returns Updated user profile
   */
  @Put('/:id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Update a user by ID (admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: ProfileDto,
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    updateProfileDto._id = id;
    return await this.userService.update(updateProfileDto);
  }
  
  /**
   * Update a user with profile image (admin only)
   * @param id User ID
   * @param updateProfileDto Update profile data
   * @param file Profile image file
   * @returns Updated user profile
   */
  @Put('/:id/with-image')
  @Roles(['admin'])
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a user with profile image (admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: ProfileDto,
  })
  async updateUserWithImage(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProfileDto> {
    return await this.userService.updateProfile(id, updateProfileDto, file);
  }
}
