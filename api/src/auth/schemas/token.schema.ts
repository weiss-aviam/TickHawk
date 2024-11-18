import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TokenDocument = HydratedDocument<Tokens>;

@Schema()
export class Tokens {
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

export const TokensDocument = SchemaFactory.createForClass(Tokens);

// Expire 1d after createdAt field value
TokensDocument.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

// Find by token
TokensDocument.index({ token: 1 });

// Find by refreshToken
TokensDocument.index({ refreshToken: 1 });

// Find by accessToken and refreshToken
TokensDocument.index({ accessToken: 1, refreshToken: 1 });