import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { ProfileDto } from './dtos/out/profile.dto';
import { plainToInstance } from 'class-transformer';
import { AssignDepartmentDto } from './dtos/in/assign-department.dto';
import { CreateUserDto } from './dtos/in/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dtos/in/update-profile.dto';
import { UserListDto } from './dtos/out/user-list.dto';
import { AssignCompanyDto } from './dtos/in/assign-company.dto';
import { FileService } from '../file/file.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly fileService: FileService,
  ) {}

  /**
   * Exist user in database
   * For init data propuse
   */
  async exist(): Promise<boolean> {
    return (await this.userModel.findOne()) !== null;
  }

  /**
   * Find a user by username
   * @param email
   * @returns
   */
  async findOne(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }

  /**
   * Find a user by id and return a profile dto
   * @param id
   * @returns
   */
  async findById(id: Types.ObjectId): Promise<ProfileDto> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return plainToInstance(ProfileDto, user.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Find all users with filtering and pagination
   * @param options
   * @returns
   */
  async findAll(options: {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<UserListDto> {
    const filter: any = {};
    
    // Apply search filter if provided
    if (options.search) {
      filter.$or = [
        { name: { $regex: options.search, $options: 'i' } },
        { email: { $regex: options.search, $options: 'i' } },
      ];
    }
    
    // Apply role filter if provided
    if (options.role) {
      filter.role = options.role;
    }
    
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.userModel.find(filter)
        .populate('companyId', 'name') // Populate the company information
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(filter),
    ]);
    
    // Map users and add company object for frontend
    const mappedUsers = users.map(user => {
      // Create a user object with ProfileDto fields
      const userDto = plainToInstance(ProfileDto, user, { 
        excludeExtraneousValues: true 
      });
      
      // Add company object if companyId exists and is populated
      if (user.companyId && typeof user.companyId === 'object' && 'name' in user.companyId) {
        // Type assertion to make TypeScript happy
        const companyData = user.companyId as { _id: Types.ObjectId; name: string };
        
        // @ts-ignore - Add company property to match frontend model
        userDto.company = {
          _id: companyData._id.toString(),
          name: companyData.name
        };
      }
      
      return userDto;
    });
    
    return plainToInstance(
      UserListDto,
      {
        users: mappedUsers,
        total,
        page,
        limit,
      },
      { excludeExtraneousValues: true },
    );
  }

  /**
   * Assign a department to a user by id
   * @param assignDepartmentDto
   * @returns
   */
  async assignDepartment(
    assignDepartmentDto: AssignDepartmentDto,
  ): Promise<boolean> {
    const update = await this.userModel.updateOne(
      { _id: assignDepartmentDto.userId },
      { $push: { departments: assignDepartmentDto.departmentId } },
    );
    return update.modifiedCount > 0;
  }

  /**
   * Assign a company to a customer user
   * @param assignCompanyDto
   * @returns
   */
  async assignCompany(
    assignCompanyDto: AssignCompanyDto,
  ): Promise<ProfileDto> {
    // Get the user
    const user = await this.userModel.findById(assignCompanyDto.userId);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    
    // Check if user is a customer - removed restriction to allow all roles
    // This allows admins and agents to be associated with companies too
    
    // Update the user - either set or unset the companyId
    if (assignCompanyDto.companyId) {
      await this.userModel.updateOne(
        { _id: assignCompanyDto.userId },
        { companyId: assignCompanyDto.companyId },
      );
    } else {
      // If companyId is null or undefined, remove the companyId field
      await this.userModel.updateOne(
        { _id: assignCompanyDto.userId },
        { $unset: { companyId: 1 } },
      );
    }
    
    // Return updated user
    const updatedUser = await this.userModel.findById(assignCompanyDto.userId);
    return plainToInstance(ProfileDto, updatedUser.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Get profile image
   * @param id
   * @returns
   */
  async getProfileImage(id: string): Promise<Buffer> {
    return this.fileService.getFile(id);
  }

  /**
   * Create a new user
   * @param user CreateUserDto
   */
  async create(user: CreateUserDto): Promise<User> {
    if (!user.password) {
      //TODO: Add block user if password is empty
      throw new Error('PASSWORD_REQUIRED');
    } else {
      user.password = bcrypt.hashSync(user.password, 10);
    }

    //TODO: PlaintoInstance
    return await this.userModel.create(new this.userModel(user));
  }
  
  /**
   * Create a new user and return ProfileDto
   * @param createUserDto 
   * @returns 
   */
  async createUser(createUserDto: CreateUserDto): Promise<ProfileDto> {
    // Check if email is already in use
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new Error('EMAIL_ALREADY_IN_USE');
    }
    
    // Create the user
    const user = await this.create(createUserDto);
    
    // Return user profile
    return plainToInstance(ProfileDto, user.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Update a user by id
   * @param profile
   * @returns
   */
  async update(profile: UpdateProfileDto): Promise<ProfileDto> {
    if (profile.password) {
      profile.password = bcrypt.hashSync(profile.password, 10);
    } else {
      delete profile.password;
    }

    const user = await this.userModel.findById(profile._id);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    await this.userModel.updateOne({ _id: profile._id }, profile);

    const newUser = await this.userModel.findById(profile._id);
    return plainToInstance(ProfileDto, newUser.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Update a user profile with file upload
   * @param id 
   * @param updateProfileDto 
   * @param file 
   * @returns 
   */
  async updateProfile(
    id: string, 
    updateProfileDto: UpdateProfileDto, 
    file?: Express.Multer.File
  ): Promise<ProfileDto> {
    updateProfileDto._id = id;
    
    // Handle profile image upload if provided
    if (file) {
      try {
        const savedFile = await this.fileService.saveFile(file, id);
        updateProfileDto.profileImage = savedFile._id.toString();
      } catch (error) {
        throw new Error('PROFILE_IMAGE_UPLOAD_FAILED');
      }
    }
    
    return this.update(updateProfileDto);
  }
}
