import { Expose } from 'class-transformer';
import { ExposeId } from 'src/config/expose-id.decorator';

class ContractDto {
  @Expose()
  @ExposeId()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  hours: number;

  @Expose()
  type: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  status: string;

  @Expose()
  created_at: Date;
}

export class CompanyDto {

  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  contracts: ContractDto[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
