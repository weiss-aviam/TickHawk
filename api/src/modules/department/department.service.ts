import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Department } from './schemas/department.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDepartmentDto } from './dtos/in/create-department.dto';
import { DepartmentDto } from './dtos/out/department.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class DepartmentService {
  private readonly logger = new Logger(DepartmentService.name);
  
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
    try {
      this.logger.debug(`Creating new department: ${createDepartmentDto.name}`);
      
      const createdDepartment = new this.departmentModel(createDepartmentDto);
      const dept = await createdDepartment.save();
      
      this.logger.debug(`Department created successfully with ID: ${dept._id}`);
      
      return plainToInstance(DepartmentDto, dept.toJSON(), {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error(`Error creating department: ${error.message}`, error.stack);
      throw new HttpException('DEPARTMENT_CREATION_FAILED', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get department by id
   * @param id Department id
   * @returns Department
   */
  async getById(id: string): Promise<DepartmentDto> {
    try {
      this.logger.debug(`Retrieving department with ID: ${id}`);
      
      const dept = await this.departmentModel.findById(id);
      if (!dept) {
        this.logger.warn(`Department not found: ${id}`);
        throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
      }
      
      this.logger.debug(`Department ${id} found: ${dept.name}`);
      
      return plainToInstance(DepartmentDto, dept.toJSON(), {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error(`Error retrieving department ${id}: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException('DEPARTMENT_RETRIEVAL_FAILED', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
    try {
      this.logger.debug(`Assigning user ${userId} to department ${departmentId}`);
      
      // Run parallel queries for better performance
      const [dept, user] = await Promise.all([
        this.departmentModel.findById(departmentId),
        this.userModel.findById(userId)
      ]);
      
      // Validate department exists
      if (!dept) {
        this.logger.warn(`Department not found for assignment: ${departmentId}`);
        throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      // Validate user exists
      if (!user) {
        this.logger.warn(`User not found for assignment: ${userId}`);
        throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      // Check if user already assigned to this department
      if (user.departmentIds.some(id => id.toString() === departmentId)) {
        this.logger.warn(`User ${userId} already assigned to department ${departmentId}`);
        throw new HttpException('USER_ALREADY_IN_DEPARTMENT', HttpStatus.BAD_REQUEST);
      }

      // Add department to user's departments
      this.logger.debug(`Adding department ${departmentId} to user ${userId}'s departments`);
      user.departmentIds.push(new Types.ObjectId(departmentId));
      await user.save();

      this.logger.debug(`User ${userId} successfully assigned to department ${departmentId}`);
      return { message: 'USER_ASSIGNED_TO_DEPARTMENT' };
    } catch (error) {
      this.logger.error(`Error assigning user to department: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException('USER_ASSIGNMENT_FAILED', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
