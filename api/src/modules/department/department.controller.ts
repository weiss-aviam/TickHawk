import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dtos/in/create-department.dto';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { Roles } from 'src/config/guard/roles/roles.decorator';

@Controller('department')
@UseGuards(JWTGuard, RolesGuard)
export class DepartmentController {
    constructor(private readonly departmentService: DepartmentService) {}

    @Post()
    @Roles(['admin'])
    async create(@Body() createDepartmentDto: CreateDepartmentDto) {
        await this.departmentService.create(createDepartmentDto);
        return HttpStatus.CREATED;
    }

    @Get()
    @Roles(['admin', 'agent', 'customer'])
    async findAll() {
        return this.departmentService.findAll();
    }
}
