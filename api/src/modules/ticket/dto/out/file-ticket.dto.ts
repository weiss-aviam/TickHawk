import { Expose } from 'class-transformer';

export class FileTicketDto {
  @Expose()
  name: string;
  @Expose()
  mimetype: string;
}
