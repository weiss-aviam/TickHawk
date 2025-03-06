import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCompanyDto } from './dtos/in/create-company.dto';
import { Company } from './schemas/company.schema';
import mongoose, { Model, Types } from 'mongoose';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CompanyDto } from './dtos/out/company.dto';
import { AddContractDto } from './dtos/in/add-contract.dto';
import { Contract, ContractSchema } from './schemas/contract.schema';
import { CompaniesDto } from './dtos/out/companies.dto';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class CompanyService {
  private readonly contractModel: Model<Contract>;
  private readonly logger = new Logger(CompanyService.name);

  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.contractModel = mongoose.model(Contract.name, ContractSchema);
  }

  /**
   * Create a company
   * @param createCompanyDto The company data
   * @returns The created company
   */
  async createCompany(createCompanyDto: CreateCompanyDto): Promise<CompanyDto> {
    try {
      this.logger.debug(`Creating new company: ${createCompanyDto.name}`);
      
      const company = new this.companyModel(createCompanyDto);
      const savedCompany = await company.save();
      
      this.logger.debug(`Company created successfully with ID: ${savedCompany._id}`);
      
      return plainToInstance(CompanyDto, savedCompany.toJSON(), {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error(`Error creating company: ${error.message}`, error.stack);
      throw new HttpException('COMPANY_CREATION_FAILED', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all companies
   * @returns
   */
  async getCompanies(): Promise<CompaniesDto[]> {
    try {
      this.logger.debug('Retrieving all companies');
      
      const companies = await this.companyModel.find();
      
      this.logger.debug(`Retrieved ${companies.length} companies`);
      
      return plainToInstance(
        CompaniesDto,
        companies.map((c) => c.toJSON()),
        {
          excludeExtraneousValues: true,
        },
      );
    } catch (error) {
      this.logger.error(`Error retrieving companies: ${error.message}`, error.stack);
      throw new HttpException('COMPANIES_RETRIEVAL_FAILED', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete a company by id
   * @param id The company
   * @returns
   * @throws HttpException if the company is not found
   */
  async deleteCompany(id: string) {
    try {
      this.logger.debug(`Attempting to delete company with ID: ${id}`);
      
      const company = await this.companyModel.findById(id);
      if (!company) {
        this.logger.warn(`Company not found for deletion: ${id}`);
        throw new HttpException('COMPANY_NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      // Check if company has users before deleting
      const usersInCompany = await this.userModel.countDocuments({ companyId: new Types.ObjectId(id) });
      if (usersInCompany > 0) {
        this.logger.warn(`Cannot delete company ${id}, it has ${usersInCompany} users assigned`);
        throw new HttpException('COMPANY_HAS_USERS', HttpStatus.BAD_REQUEST);
      }
      
      const result = await this.companyModel.deleteOne({ _id: id });
      
      this.logger.debug(`Company deleted successfully: ${id}, deleted count: ${result.deletedCount}`);
    } catch (error) {
      this.logger.error(`Error deleting company ${id}: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException('COMPANY_DELETION_FAILED', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  /**
   * Add a contract to a company
   * @param addContractDto
   * @returns
   * @throws HttpException if the company is not found
   */
  async addContract(
    id: string,
    addContractDto: AddContractDto,
  ): Promise<CompanyDto> {
    const company = await this.companyModel.findById(id);
    if (!company) {
      throw new HttpException('COMPANY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    const plain = instanceToPlain(addContractDto);
    const contract = plainToInstance(this.contractModel, plain);

    contract._id = new Types.ObjectId();
    company.contracts.push(contract);

    const savedCompany = await company.save();
    return plainToInstance(CompanyDto, savedCompany.toJSON(), {
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
    return plainToInstance(CompanyDto, savedCompany.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Get a company by id
   * @param id The company id
   * @returns The company
   */
  async getById(id: string): Promise<CompanyDto> {
    const company = await this.companyModel.findById(id);
    if (!company) {
      throw new HttpException('COMPANY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return plainToInstance(CompanyDto, company.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Update a company
   * @param id The company id
   * @param updateCompanyDto The company data
   * @returns The updated company
   */
  async updateCompany(id: string, updateCompanyDto: CreateCompanyDto): Promise<CompanyDto> {
    const company = await this.companyModel.findById(id);
    if (!company) {
      throw new HttpException('COMPANY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    company.name = updateCompanyDto.name;
    company.email = updateCompanyDto.email;

    const savedCompany = await company.save();
    return plainToInstance(CompanyDto, savedCompany.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Get all users from a company
   * @param companyId The company id
   * @returns List of users
   */
  async getCompanyUsers(companyId: string) {
    const company = await this.companyModel.findById(companyId);
    if (!company) {
      throw new HttpException('COMPANY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    
    const users = await this.userModel.find({ companyId: new Types.ObjectId(companyId) });
    return users;
  }

  /**
   * Assign a user to a company
   * @param companyId The company id
   * @param userId The user id
   * @returns Confirmation message
   */
  async assignUserToCompany(companyId: string, userId: string) {
    const company = await this.companyModel.findById(companyId);
    if (!company) {
      throw new HttpException('COMPANY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // Update user's company
    user.companyId = new Types.ObjectId(companyId);
    await user.save();

    return { message: 'USER_ASSIGNED_TO_COMPANY' };
  }

  /**
   * Remove a user from a company
   * @param companyId The company id
   * @param userId The user id
   * @returns Confirmation message
   */
  async removeUserFromCompany(companyId: string, userId: string) {
    const company = await this.companyModel.findById(companyId);
    if (!company) {
      throw new HttpException('COMPANY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // Check if user belongs to this company
    if (user.companyId.toString() !== companyId) {
      throw new HttpException('USER_NOT_IN_COMPANY', HttpStatus.BAD_REQUEST);
    }

    // Remove user's company
    user.companyId = null;
    await user.save();

    return { message: 'USER_REMOVED_FROM_COMPANY' };
  }
}
