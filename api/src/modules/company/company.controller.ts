import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/in/create-company.dto';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';
import { Roles } from 'src/config/guard/roles/roles.decorator';
import { AddContractDto } from './dtos/in/add-contract.dto';

@Controller('company')
@UseGuards(JWTGuard, RolesGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  /**
   * Create a new company in the database
   * @param createCompanyDto The data to create the company
   * @returns The created company
   */
  @Post()
  @Roles(['admin'])
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.createCompany(createCompanyDto);
  }

  /**
   * Get all companies in the database (only for admin)
   * @returns All companies
   */
  @Get()
  @Roles(['admin'])
  async getCompanies() {
    return await this.companyService.getCompanies();
  }

  /**
   * Get a company by its id (only for admin)
   * @param id The company id
   * @returns The company
   */
  @Delete(':id')
  @Roles(['admin'])
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
  async removeContract(@Param('id') id: string) {
    return await this.companyService.removeContract(id);
  }
}
