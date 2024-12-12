import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, now, Document} from 'mongoose';
import { UserTicket, UserTicketSchema } from './user-ticket.schema';

export type EventSchema = HydratedDocument<Event>;

@Schema()
export class Event extends Document {
  @Prop({
    type: UserTicketSchema,
    required: true,
  })
  user: UserTicket;

  @Prop({
    required: true,
    enum: ['close', 'open', 're-open', 'transfer'],
  })
  type: string;

  @Prop({})
  createdAt: Date;

  @Prop({})
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

EventSchema.pre('save', function (next) {
  this.updatedAt = now();
  // Its new ticket
  if (!this.createdAt) {
    this.createdAt = this.updatedAt;
  }
  next();
});

