import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<Users>;

@Schema()
export class Users {
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
    ref: 'Companies',
  })
  companyId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ['admin', 'tech', 'customer'],
  })
  kind: string;

  @Prop([String])
  permissions: string[];
}

export const UserDocument = SchemaFactory.createForClass(Users);

// Index by email
UserDocument.index({ email: 1 }, { unique: true });