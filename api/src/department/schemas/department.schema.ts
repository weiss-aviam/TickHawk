import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DepartmentSchema = HydratedDocument<Department>;

@Schema()
export class Department extends Document {
  @Prop({
    required: true,
  })
  name: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);

DepartmentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});
