import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, now, Document} from 'mongoose';
import { UserTicket, UserTicketSchema } from './user-ticket.schema';
import { FileTicket, FileTicketSchema } from './file-ticket.schema';

export type CommentSchema = HydratedDocument<Comment>;

@Schema()
export class Comment extends Document {
  @Prop({
    type: UserTicketSchema,
    required: true,
  })
  user: UserTicket;

  @Prop({
    required: true,
  })
  content: string;
  
  @Prop()
  minutes: number;

  @Prop({
    type: [FileTicketSchema],
    default: [],
  })
  files: FileTicket[];

  @Prop({default: now()})
  createdAt: Date;

  @Prop({default: now()})
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});
