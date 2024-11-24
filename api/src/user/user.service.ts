import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {}


    /**
     * Find a user by username
     * @param email 
     * @returns 
     */
    async findOne(email: string): Promise<User> {
        return await this.userModel.findOne({ email: email });
    }

    async findById(id: Types.ObjectId): Promise<User> {
        return await this.userModel.findById(id);
    }
}
