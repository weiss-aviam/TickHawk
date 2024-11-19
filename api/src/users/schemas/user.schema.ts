import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Permission, PermissionSchema } from './permission.shema';

export type UserSchema = HydratedDocument<User>;

@Schema()
export class User {
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
    ref: 'companies',
  })
  companyId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ['admin', 'tech', 'customer'],
  })
  kind: string;

  @Prop({ type: [PermissionSchema], default: [] })
  permissions: Permission[];

}

export const UserSchema = SchemaFactory.createForClass(User);

// Index by email
UserSchema.index({ email: 1 }, { unique: true });