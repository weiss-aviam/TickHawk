import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, now } from 'mongoose';
import { Comment, CommentSchema } from './comment.schema';
import { Event, EventSchema } from './event.schema';
import { Department } from 'src/department/schemas/department.schema';
import { User } from 'src/user/schemas/user.schema';
import { Company } from 'src/company/schemas/company.schema';

export type TicketSchema = HydratedDocument<Ticket>;

@Schema()
export class Ticket extends Document {
  @Prop({
    required: true,
  })
  status: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Company.name,
  })
  companyId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  customerId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  agentId: Types.ObjectId;

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

  @Prop({ type: [EventSchema], default: [] })
  events: Event[];

  @Prop({ 
    type: Types.ObjectId,
    ref: Department.name,
    required: true,
  })
  departmentId: Types.ObjectId;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

// Index by companyId and status
TicketSchema.index({ companyId: 1, status: 1 });

// Update hours
TicketSchema.pre('save', function (next) {
  if (!this.isModified('comments')) {
    return next();
  }

  this.hours = this.comments
    .map((comment) => comment.hours) as [number];
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
