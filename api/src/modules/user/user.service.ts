import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { ProfileDto } from './dtos/profile.dto';
import { plainToInstance } from 'class-transformer';
import { AssignDepartmentDto } from './dtos/assign-department.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

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
}
