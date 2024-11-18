import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(Users.name) private readonly userModel: Model<Users>
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
