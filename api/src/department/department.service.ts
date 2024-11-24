import { Injectable } from '@nestjs/common';
import { Department } from './schemas/department.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DepartmentService {
    constructor(@InjectModel(Department.name) private readonly departmentModel) {}
    

    
}
