import { Injectable } from '@nestjs/common';
import { Customer } from './schemas/customer.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>
    ) {}



    /**
     * Find a customer by username
     * @param email 
     * @returns 
     */
    async findOne(email: string) {
        const user = await this.customerModel.findOne({ email: email });
        return user;
    }
}
