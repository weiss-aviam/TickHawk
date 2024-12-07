import { Expose } from 'class-transformer';

export class CompanyTicketDto {
  @Expose()
  _id: string;
  @Expose()
  _id: string;

  @Expose()
  name: string;
  @Expose()
  email: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
