import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    async findOne(email: string) {
        const user = await this.userModel.findOne({ email: email });
        return user;
    }
}
