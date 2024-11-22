import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token extends Document {
  @Prop({
    required: true,
  })
  accessToken: number;

  @Prop({
    required: true,
  })
  refreshToken: string;

  @Prop({
    required: true,
  })
  blocked: boolean;

  @Prop({
    required: true,
  })
  expiration: Date;

  @Prop({
    required: true,
  })
  createdAt: Date;

  //TODO: Data about location, device, etc.
}

export const TokenSchema = SchemaFactory.createForClass(Token);

// Expire 1d after createdAt field value
TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

// Find by token
TokenSchema.index({ token: 1 });

// Find by refreshToken
TokenSchema.index({ refreshToken: 1 });

// Find by accessToken and refreshToken
TokenSchema.index({ accessToken: 1, refreshToken: 1 });

TokenSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});
