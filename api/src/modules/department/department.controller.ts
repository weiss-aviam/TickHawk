import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dtos/in/create-department.dto';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { Roles } from 'src/config/guard/roles/roles.decorator';
import { DepartmentDto } from './dtos/out/department.dto';

@Controller('department')
@UseGuards(JWTGuard, RolesGuard)
export class DepartmentController {
    constructor(private readonly departmentService: DepartmentService) {}

    /**
     * Create a department
     * @param createDepartmentDto The department data 
     * @returns The created department
     */
    @Post()
    @Roles(['admin'])
    async create(@Body() createDepartmentDto: CreateDepartmentDto) {
        await this.departmentService.create(createDepartmentDto);
        return HttpStatus.CREATED;
    }

    /**
     * Get all departments
     * @returns 
     */
    @Get()
    @Roles(['admin', 'agent', 'customer'])
    async findAll(): Promise<DepartmentDto[]> {
        return await this.departmentService.findAll();
    }
}
