import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/in/create-company.dto';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';
import { Roles } from 'src/config/guard/roles/roles.decorator';
import { AddContractDto } from './dtos/in/add-contract.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('company')
@UseGuards(JWTGuard, RolesGuard)
@ApiTags('Company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  /**
   * Create a new company in the database
   * @param createCompanyDto The data to create the company
   * @returns The created company
   */
  @Post()
  @Roles(['admin'])
  @ApiOperation({ summary: 'Create a new company' })
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.createCompany(createCompanyDto);
  }

  /**
   * Get all companies in the database
   * @returns All companies
   */
  @Get()
  @Roles(['admin', 'agent'])
  @ApiOperation({ summary: 'Get all companies' })
  async getCompanies() {
    return await this.companyService.getCompanies();
  }

  /**
   * Get a company by its id
   * @param id The company id
   * @returns The company
   */
  @Get(':id')
  @Roles(['admin', 'agent'])
  @ApiOperation({ summary: 'Get a company by id' })
  async getCompany(@Param('id') id: string) {
    return await this.companyService.getById(id);
  }

  /**
   * Update a company
   * @param id The company id
   * @param updateCompanyDto The data to update the company
   * @returns The updated company
   */
  @Put(':id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Update a company' })
  async updateCompany(@Param('id') id: string, @Body() updateCompanyDto: CreateCompanyDto) {
    return await this.companyService.updateCompany(id, updateCompanyDto);
  }

  /**
   * Delete a company
   * @param id The company id
   * @returns Confirmation message
   */
  @Delete(':id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Delete a company' })
  async deleteCompany(@Param('id') id: string) {
    return await this.companyService.deleteCompany(id);
  }

  /**
   * Add a contract to a company (only for admin)
   * @param id The company id
   * @param addContractDto The data to add the contract
   * @returns The company with the new contract
   */
  @Post('contract/:id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Add a contract to a company' })
  async addContract(@Param('id') id: string, @Body() addContractDto: AddContractDto) {
    return await this.companyService.addContract(id, addContractDto);
  }

  /**
   * Remove a contract from a company (only for admin)
   * @param id The contract id
   * @returns The company without the contract
   */
  @Delete('contract/:id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Remove a contract from a company' })
  async removeContract(@Param('id') id: string) {
    return await this.companyService.removeContract(id);
  }

  /**
   * Get all users from a company
   * @param id The company id
   * @returns List of users
   */
  @Get(':id/users')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Get all users from a company' })
  async getCompanyUsers(@Param('id') id: string) {
    return await this.companyService.getCompanyUsers(id);
  }

  /**
   * Assign a user to a company
   * @param companyId The company id
   * @param userId The user id
   * @returns Confirmation message
   */
  @Post(':companyId/user/:userId')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Assign a user to a company' })
  async assignUserToCompany(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
  ) {
    return await this.companyService.assignUserToCompany(companyId, userId);
  }

  /**
   * Remove a user from a company
   * @param companyId The company id
   * @param userId The user id
   * @returns Confirmation message
   */
  @Delete(':companyId/user/:userId')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Remove a user from a company' })
  async removeUserFromCompany(
    @Param('companyId') companyId: string, 
    @Param('userId') userId: string
  ) {
    return await this.companyService.removeUserFromCompany(companyId, userId);
  }
}
