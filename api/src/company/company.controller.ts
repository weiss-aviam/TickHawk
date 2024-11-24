import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';
import { Roles } from 'src/config/guard/roles/roles.decorator';

@Controller('company')
@UseGuards(JWTGuard, RolesGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}


  @Post()
  @Roles(['admin'])
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.createCompany(createCompanyDto);
  }

  @Get()
  @Roles(['admin', 'agent'])
  async getCompanies() {
    return this.companyService.getCompanies();
  }
}
