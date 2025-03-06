import { Expose } from 'class-transformer';
import { ExposeId } from 'src/config/expose-id.decorator';
import { UserTicketDto } from './user-ticket.dto';
import { FileTicketDto } from './file-ticket.dto';

export class CommentDto {
  @Expose()
  @ExposeId()
  _id: string;

    @Expose()
    user: UserTicketDto;
    

    @Expose()
    content: string;

    @Expose()
    hours: number;

    @Expose()
    files: FileTicketDto[];

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}