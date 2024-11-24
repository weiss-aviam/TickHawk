import { Injectable } from '@nestjs/common';
import { Department } from './schemas/department.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { DepartmentDto } from './dtos/department.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DepartmentService {
  constructor(@InjectModel(Department.name) private readonly departmentModel) {}

  async create(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentDto> {
    const createdDepartment = new this.departmentModel(createDepartmentDto);
    const dept = createdDepartment.save();
    return plainToInstance(DepartmentDto, dept, {
      excludeExtraneousValues: true,
    });
  }
}
