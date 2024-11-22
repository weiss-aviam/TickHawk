import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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
        const user = await this.userModel.findOne({ email: email });
        return user;
    }
}
