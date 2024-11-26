import { Expose } from 'class-transformer';

export class CompanyDto {
  @Expose()
  _id: string;
  
  @Expose()
  name: string;

  @Expose()
  email: string;
}
