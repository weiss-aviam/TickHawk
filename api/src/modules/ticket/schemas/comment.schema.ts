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
  
  @Prop({
    required: false,
  })
  minutes: number;

  @Prop({
    type: [FileTicketSchema],
    default: [],
  })
  files: FileTicket[];

  @Prop({})
  createdAt: Date;

  @Prop({})
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

CommentSchema.pre('save', function (next) {
  this.updatedAt = now();
  // Its new ticket
  if (!this.createdAt) {
    this.createdAt = this.updatedAt;
  }
  next();
});

