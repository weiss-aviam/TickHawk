import { Expose } from 'class-transformer';
import { ExposeId } from 'src/config/expose-id.decorator';

export class CompaniesDto {
  @Expose()
  @ExposeId()
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
