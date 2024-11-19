import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCompanyDto } from './dtos/create-company.dto';

@Injectable()
export class CompaniesService {
    constructor(@InjectModel('companies') private readonly companyModel) {}
    
    async createCompany(createCompanyDto: CreateCompanyDto) {
        const company = new this.companyModel(createCompanyDto);
        return company.save();
    }
}
