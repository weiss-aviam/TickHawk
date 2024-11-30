import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now, Document } from 'mongoose';
import { Comment, CommentSchema } from './comment.schema';
import { Event, EventSchema } from './event.schema';
import { UserTicket, UserTicketSchema } from './user-ticket.schema';
import { CompanyTicket, CompanyTicketSchema } from './company-ticket.schema';
import { DepartmentTicket } from './department-ticket.schema';

export type TicketSchema = HydratedDocument<Ticket>;

@Schema()
export class Ticket extends Document {
  @Prop({
    required: true,
    enum: ['open', 'closed', 'in-progress', 'in-review'],
  })
  status: string;

  @Prop({
    required: true,
    enum: ['low', 'medium', 'high'],
  })
  priority: string;

  @Prop({
    required: true,
    type: CompanyTicketSchema,
  })
  company: CompanyTicket;

  @Prop({
    type: UserTicketSchema,
    required: true,
  })
  customer: UserTicket;

  @Prop({
    type: UserTicketSchema,
    required: false,
  })
  agent: UserTicket;

  @Prop({
    required: true,
  })
  subject: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: false,
  })
  minutes: [number];

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @Prop({ type: [EventSchema], default: [] })
  events: Event[];

  @Prop({ 
    type: DepartmentTicket,
    required: true,
  })
  department: DepartmentTicket;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

// Index by companyId and status
TicketSchema.index({ companyId: 1, status: 1 });

// Update minutes
TicketSchema.pre('save', function (next) {
  if (!this.isModified('comments')) {
    return next();
  }

  this.minutes = this.comments
    .map((comment) => comment.minutes) as [number];
  next();
});

// Update updatedAt
TicketSchema.pre('save', function (next) {
  this.updatedAt = now();
  next();
});

TicketSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});
