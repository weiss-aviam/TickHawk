import { Expose } from 'class-transformer';
import { ExposeId } from 'src/config/expose-id.decorator';

export class TicketDto {
  @Expose()
  @ExposeId()
  _id: string;
  
  @Expose()
  status: string;

  @Expose()
  priority: string;

  @Expose()
  company: string;

  @Expose()
  customer: Object;

  @Expose()
  agent: Object;

  @Expose()
  subject: string;

  @Expose()
  content: string;

  @Expose()
  minutes: [number];

  @Expose()
  comments: object[];

  @Expose()
  events: object[];

  @Expose()
  department: object;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
