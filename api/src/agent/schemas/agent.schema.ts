import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AgentSchema = HydratedDocument<Agent>;

@Schema()
export class Agent {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  email: number;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
    enum: ['admin', 'agent'],
    default: 'agent',
  })
  role: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Department',
    required: true,
  })
  departments: Types.ObjectId[];
}

export const AgentSchema = SchemaFactory.createForClass(Agent);

// Index by email
AgentSchema.index({ email: 1 }, { unique: true });
