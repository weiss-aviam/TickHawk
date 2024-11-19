import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, now } from 'mongoose';
import { Contract, ContractSchema } from './contract.schema';

export type CompanySchema = HydratedDocument<Company>;

@Schema()
export class Company {
  @Prop({
    required: true,
  })
  name: string;

  @Prop()
  email: string;

  @Prop({ type: [ContractSchema], default: [] })
  contracts: Contract[];

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

// Update updatedAt
CompanySchema.pre('save', function (next) {
  this.updatedAt = now();
  next();
});
