import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema()
export class Company {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  unlimited_hours: boolean;
}

export const CompanyDocument = SchemaFactory.createForClass(Company);
