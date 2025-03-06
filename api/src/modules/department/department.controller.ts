import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dtos/in/create-department.dto';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { Roles } from 'src/config/guard/roles/roles.decorator';
import { DepartmentDto } from './dtos/out/department.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('department')
@UseGuards(JWTGuard, RolesGuard)
@ApiTags('Department')
export class DepartmentController {
    constructor(private readonly departmentService: DepartmentService) {}

    /**
     * Create a department
     * @param createDepartmentDto The department data 
     * @returns The created department
     */
    @Post()
    @Roles(['admin'])
    @ApiOperation({ summary: 'Create a new department' })
    async create(@Body() createDepartmentDto: CreateDepartmentDto) {
        await this.departmentService.create(createDepartmentDto);
        return HttpStatus.CREATED;
    }

    /**
     * Get all departments
     * @returns List of departments
     */
    @Get()
    @Roles(['admin', 'agent', 'customer'])
    @ApiOperation({ summary: 'Get all departments' })
    async findAll(): Promise<DepartmentDto[]> {
        return await this.departmentService.findAll();
    }

    /**
     * Get department by id
     * @param id Department id
     * @returns Department
     */
    @Get(':id')
    @Roles(['admin', 'agent'])
    @ApiOperation({ summary: 'Get department by id' })
    async findOne(@Param('id') id: string): Promise<DepartmentDto> {
        return await this.departmentService.findOne(id);
    }

    /**
     * Update department
     * @param id Department id
     * @param updateDepartmentDto Department data
     * @returns Updated department
     */
    @Put(':id')
    @Roles(['admin'])
    @ApiOperation({ summary: 'Update a department' })
    async update(@Param('id') id: string, @Body() updateDepartmentDto: CreateDepartmentDto) {
        return await this.departmentService.update(id, updateDepartmentDto);
    }

    /**
     * Delete department
     * @param id Department id
     * @returns Status
     */
    @Delete(':id')
    @Roles(['admin'])
    @ApiOperation({ summary: 'Delete a department' })
    async remove(@Param('id') id: string) {
        await this.departmentService.remove(id);
        return { message: 'DEPARTMENT_DELETED' };
    }

    /**
     * Get users from department
     * @param id Department id
     * @returns List of users
     */
    @Get(':id/users')
    @Roles(['admin'])
    @ApiOperation({ summary: 'Get all users from a department' })
    async getDepartmentUsers(@Param('id') id: string) {
        return await this.departmentService.getDepartmentUsers(id);
    }

    /**
     * Add user to department
     * @param departmentId Department id
     * @param userId User id
     * @returns Status
     */
    @Post(':departmentId/user/:userId')
    @Roles(['admin'])
    @ApiOperation({ summary: 'Assign a user to a department' })
    async assignUserToDepartment(
        @Param('departmentId') departmentId: string,
        @Param('userId') userId: string
    ) {
        return await this.departmentService.assignUserToDepartment(departmentId, userId);
    }

    /**
     * Remove user from department
     * @param departmentId Department id
     * @param userId User id
     * @returns Status
     */
    @Delete(':departmentId/user/:userId')
    @Roles(['admin'])
    @ApiOperation({ summary: 'Remove a user from a department' })
    async removeUserFromDepartment(
        @Param('departmentId') departmentId: string,
        @Param('userId') userId: string
    ) {
        return await this.departmentService.removeUserFromDepartment(departmentId, userId);
    }
}
