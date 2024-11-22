import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, now} from 'mongoose';

export type EventSchema = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop({
    type: Types.ObjectId,
    ref: 'user',
  })
  userId: Types.ObjectId;

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