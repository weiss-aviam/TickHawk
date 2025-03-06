import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Department } from './schemas/department.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDepartmentDto } from './dtos/in/create-department.dto';
import { DepartmentDto } from './dtos/out/department.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<Department>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  /**
   * Create a new department
   * @param createDepartmentDto Department data
   * @returns Created department
   */
  async create(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentDto> {
    const createdDepartment = new this.departmentModel(createDepartmentDto);
    const dept = await createdDepartment.save();
    return plainToInstance(DepartmentDto, dept.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Get department by id
   * @param id Department id
   * @returns Department
   */
  async getById(id: string): Promise<DepartmentDto> {
    const dept = await this.departmentModel.findById(id);
    if (!dept) {
      throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return plainToInstance(DepartmentDto, dept.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Get all departments
   * @returns List of departments
   */
  async findAll(): Promise<DepartmentDto[]> {
    const depts = await this.departmentModel.find();
    return depts.map((dept) =>
      plainToClass(DepartmentDto, dept.toJSON(), {
        excludeExtraneousValues: true,
      }),
    );
  }

  /**
   * Get department by id
   * @param id Department id
   * @returns Department
   */
  async findOne(id: string): Promise<DepartmentDto> {
    return this.getById(id);
  }

  /**
   * Update department
   * @param id Department id
   * @param updateDepartmentDto Department data
   * @returns Updated department
   */
  async update(id: string, updateDepartmentDto: CreateDepartmentDto): Promise<DepartmentDto> {
    const dept = await this.departmentModel.findById(id);
    if (!dept) {
      throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    dept.name = updateDepartmentDto.name;
    const savedDept = await dept.save();
    
    return plainToInstance(DepartmentDto, savedDept.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Delete department
   * @param id Department id
   */
  async remove(id: string): Promise<void> {
    const dept = await this.departmentModel.findById(id);
    if (!dept) {
      throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // Check if there are users in this department
    const usersInDept = await this.userModel.find({
      departmentIds: new Types.ObjectId(id)
    });

    if (usersInDept.length > 0) {
      throw new HttpException('DEPARTMENT_HAS_USERS', HttpStatus.BAD_REQUEST);
    }

    await this.departmentModel.deleteOne({ _id: id });
  }

  /**
   * Get users from department
   * @param departmentId Department id
   * @returns List of users
   */
  async getDepartmentUsers(departmentId: string) {
    const dept = await this.departmentModel.findById(departmentId);
    if (!dept) {
      throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const users = await this.userModel.find({
      departmentIds: new Types.ObjectId(departmentId)
    });

    return users;
  }

  /**
   * Assign user to department
   * @param departmentId Department id
   * @param userId User id
   * @returns Status
   */
  async assignUserToDepartment(departmentId: string, userId: string) {
    const dept = await this.departmentModel.findById(departmentId);
    if (!dept) {
      throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // Check if user already assigned to this department
    if (user.departmentIds.some(id => id.toString() === departmentId)) {
      throw new HttpException('USER_ALREADY_IN_DEPARTMENT', HttpStatus.BAD_REQUEST);
    }

    // Add department to user's departments
    user.departmentIds.push(new Types.ObjectId(departmentId));
    await user.save();

    return { message: 'USER_ASSIGNED_TO_DEPARTMENT' };
  }

  /**
   * Remove user from department
   * @param departmentId Department id
   * @param userId User id
   * @returns Status
   */
  async removeUserFromDepartment(departmentId: string, userId: string) {
    const dept = await this.departmentModel.findById(departmentId);
    if (!dept) {
      throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // Check if user is in this department
    if (!user.departmentIds.some(id => id.toString() === departmentId)) {
      throw new HttpException('USER_NOT_IN_DEPARTMENT', HttpStatus.BAD_REQUEST);
    }

    // Remove department from user's departments
    user.departmentIds = user.departmentIds.filter(id => id.toString() !== departmentId);
    await user.save();

    return { message: 'USER_REMOVED_FROM_DEPARTMENT' };
  }
}
