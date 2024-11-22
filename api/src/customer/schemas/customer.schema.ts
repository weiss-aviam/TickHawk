import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import { Company } from 'src/company/schemas/company.schema';

export type CustomerSchema = HydratedDocument<Customer>;

@Schema()
export class Customer extends Document {
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
    type: Types.ObjectId,
    ref: Company.name,
  })
  companyId: Types.ObjectId;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer) ;

// Index by email
CustomerSchema.index({ email: 1 }, { unique: true });


CustomerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});