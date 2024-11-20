import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Company, CompanySchema } from 'src/company/schemas/company.schema';

export type CustomerSchema = HydratedDocument<Customer>;

@Schema()
export class Customer {
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
    required: true,
    type: CompanySchema,
    ref: 'Companies',
  })
  company: Company;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

// Index by email
CustomerSchema.index({ email: 1 }, { unique: true });
