import { Expose } from 'class-transformer';
import { ExposeId } from 'src/config/expose-id.decorator';

export class UserTicketDto {
  @Expose()
  @ExposeId()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  role: string;
}
