import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { Company } from './schemas/company.schema';
import { Model } from 'mongoose';

@Injectable()
export class CompanyService {
    constructor(@InjectModel(Company.name) private readonly companyModel: Model<Company>) {}
    
    async createCompany(createCompanyDto: CreateCompanyDto) {
        const company = new this.companyModel(createCompanyDto);
        return company.save();
    }

    async getCompanies() {
        return this.companyModel.find();
    }
}
