import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { ProfileDto } from './dtos/out/profile.dto';
import { plainToInstance } from 'class-transformer';
import { AssignDepartmentDto } from './dtos/in/assign-department.dto';
import { CreateUserDto } from './dtos/in/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Exist user in database
   * For init data propuse
   */
  async exist(): Promise<boolean> {
    return await this.userModel.findOne() !== null;
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
   * Cretae a new user
   * @param user CreateUserDto
   */
  async create(user: CreateUserDto): Promise<User> {
    if (!user.password) {
      //TODO: Add block user if password is empty
      throw new Error('PASSWORD_REQUIRED');
    }else{
      user.password = bcrypt.hashSync(user.password, 10);
    }

    return await this.userModel.create(new this.userModel(user));
  }
}
