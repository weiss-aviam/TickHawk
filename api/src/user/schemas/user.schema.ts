import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

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
    type: String,
    required: true,
    enum: ['admin', 'tech'],
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index by email
UserSchema.index({ email: 1 }, { unique: true });
