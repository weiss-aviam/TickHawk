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
     * @param username 
     * @returns 
     */
    async findOne(username: string) {
        const user = await this.userModel.findOne({ email: username });
        return user;
    }
}
