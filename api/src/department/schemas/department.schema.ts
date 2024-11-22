import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DepartmentSchema = HydratedDocument<Department>;

@Schema()
export class Department {
  @Prop({
    required: true,
  })
  name: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);