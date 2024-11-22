import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agent } from './schemas/agent.schema';

@Injectable()
export class AgentService {

    constructor(
        @InjectModel(Agent.name) private readonly agentModel: Model<Agent>
    ) {}



    /**
     * Find a agent by username
     * @param email 
     * @returns 
     */
    async findOne(email: string) {
        const agent = await this.agentModel.findOne({ email: email });
        return agent;
    }
}
