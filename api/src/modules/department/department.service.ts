import { Injectable } from '@nestjs/common';
import { Department } from './schemas/department.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDepartmentDto } from './dtos/in/create-department.dto';
import { DepartmentDto } from './dtos/out/department.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<Department>,
  ) {}

  async create(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentDto> {
    const createdDepartment = new this.departmentModel(createDepartmentDto);
    const dept = await createdDepartment.save();
    return plainToInstance(DepartmentDto, dept.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  async getById(id: string): Promise<DepartmentDto> {
    const dept = await this.departmentModel.findById(id);
    return plainToInstance(DepartmentDto, dept.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<DepartmentDto[]> {
    const depts = await this.departmentModel.find();
    return depts.map((dept) =>
      plainToClass(DepartmentDto, dept.toJSON(), {
        excludeExtraneousValues: true,
      }),
    );
  }
}
