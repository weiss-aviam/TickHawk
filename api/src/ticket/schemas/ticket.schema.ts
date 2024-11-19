import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, now } from 'mongoose';
import { Comment, CommentSchema } from './comment.schema';

export type TicketSchema = HydratedDocument<Ticket>;

@Schema()
export class Ticket {
  @Prop({
    required: true,
  })
  status: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'companies',
  })
  companyId: Types.ObjectId;
  
  @Prop({
    type: Types.ObjectId,
    ref: 'user',
  })
  clientId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'user',
  })
  technicianId: Types.ObjectId;

  @Prop({
    required: true,
  })
  subjet: number;

  @Prop({
    required: true,
  })
  content: string;
  
  @Prop({
    required: true,
  })
  hours: [number];

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @Prop({default: now()})
  createdAt: Date;

  @Prop({default: now()})
  updatedAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

// Index by companyId and status
TicketSchema.index({ companyId: 1, status: 1 });
