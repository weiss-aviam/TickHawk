import { Expose } from 'class-transformer';
import { ExposeId } from 'src/config/expose-id.decorator';
import { FileTicketDto } from './file-ticket.dto';
import { DepartmentTicketDto } from './department-ticket.dto';
import { CompanyTicketDto } from './company-ticket.dto';
import { CommentDto } from './comment.dto';

export class TicketDto {
  @Expose()
  @ExposeId()
  _id: string;
  
  @Expose()
  status: string;

  @Expose()
  priority: string;

  @Expose()
  company: CompanyTicketDto;

  @Expose()
  customer: Object;

  @Expose()
  agent: Object;

  @Expose()
  subject: string;

  @Expose()
  content: string;
  
  @Expose()
  content_user: string;

  @Expose()
  files: FileTicketDto[];

  @Expose()
  minutes: number;

  @Expose()
  comments: CommentDto[];

  @Expose()
  events: object[];

  @Expose()
  department: DepartmentTicketDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
