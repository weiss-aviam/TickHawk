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
  userId: UserTicket;

  @Prop({
    required: true,
    enum: ['close', 'open', 're-open', 'transfer'],
  })
  type: string;

  @Prop({default: now()})
  createdAt: Date;

  @Prop({default: now()})
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});
