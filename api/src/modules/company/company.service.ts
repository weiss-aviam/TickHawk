import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { Company } from './schemas/company.schema';
import { Model, Types } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { CompanyDto } from './dtos/company.dto';
import { AddContractDto } from './dtos/add-contract.dto';
import { Contract } from './schemas/contract.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) {}

  /**
   * Create a company
   * @param createCompanyDto The company data
   * @returns The created company
   */
  async createCompany(createCompanyDto: CreateCompanyDto): Promise<CompanyDto> {
    const company = new this.companyModel(createCompanyDto);
    const savedCompany = await company.save();
    return plainToInstance(CompanyDto, savedCompany, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Get all companies
   * @returns
   */
  async getCompanies(): Promise<CompanyDto[]> {
    const companies = await this.companyModel.find();
    return plainToInstance(CompanyDto, companies, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Delete a company by id
   * @param id The company
   * @returns
   * @throws HttpException if the company is not found
   */
  async deleteCompany(id: string) {
    const company = await this.companyModel.findById(id);
    if (!company) {
      throw new HttpException('COMPANY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await this.companyModel.deleteOne({ _id: id });
  }
  /**
   * Add a contract to a company
   * @param addContractDto
   * @returns
   * @throws HttpException if the company is not found
   */
  async addContract(addContractDto: AddContractDto): Promise<CompanyDto> {
    const company = await this.companyModel.findById(addContractDto.companyId);
    if (!company) {
      throw new HttpException('COMPANY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const contract = plainToInstance(Contract, addContractDto);
    contract._id = new Types.ObjectId();
    company.contracts.push(contract);

    const savedCompany = await company.save();
    return plainToInstance(CompanyDto, savedCompany, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Remove a contract from a company by id
   * @param id The contract id
   * @returns The company without the contract
   * @throws HttpException if the contract is not found
   */
  async removeContract(id: string): Promise<CompanyDto> {
    const company = await this.companyModel.findOne({ 'contracts._id': id });
    if (!company) {
      throw new HttpException('CONTRACT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    company.contracts = company.contracts.filter(
      (contract) => contract._id.toString() !== id,
    );

    const savedCompany = await company.save();
    return plainToInstance(CompanyDto, savedCompany, {
      excludeExtraneousValues: true,
    });
  }
}
