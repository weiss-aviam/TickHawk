import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';
import { Roles } from 'src/config/guard/roles/roles.decorator';
import { AddContractDto } from './dtos/add-contract.dto';

@Controller('company')
@UseGuards(JWTGuard, RolesGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Roles(['admin'])
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.createCompany(createCompanyDto);
  }

  @Get()
  @Roles(['admin'])
  async getCompanies() {
    return await this.companyService.getCompanies();
  }

  @Delete(':id')
  @Roles(['admin'])
  async deleteCompany(@Param('id') id: string) {
    return await this.companyService.deleteCompany(id);
  }

  @Post('contract/:id')
  @Roles(['admin'])
  async addContract(@Param('id') id: string, @Body() addContractDto: AddContractDto) {
    return await this.companyService.addContract(id, addContractDto);
  }

  @Delete('contract/:id')
  @Roles(['admin'])
  async removeContract(@Param('id') id: string) {
    return await this.companyService.removeContract(id);
  }
}
