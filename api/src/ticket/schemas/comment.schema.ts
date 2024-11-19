import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, now} from 'mongoose';

export type CommentSchema = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({
    type: Types.ObjectId,
    ref: 'user',
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
  })
  content: string;
  
  @Prop()
  hours: number;

  @Prop({default: now()})
  createdAt: Date;

  @Prop({default: now()})
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);