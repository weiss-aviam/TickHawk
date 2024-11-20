import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { Company } from './schemas/company.schema';

@Injectable()
export class CompanyService {
    constructor(@InjectModel(Company.name) private readonly companyModel) {}
    
    async createCompany(createCompanyDto: CreateCompanyDto) {
        const company = new this.companyModel(createCompanyDto);
        return company.save();
    }
}
