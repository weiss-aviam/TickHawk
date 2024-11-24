import { Expose } from 'class-transformer';

export class DepartmentDto {
  @Expose()
  _id: string;

  @Expose()
  name: string;
}
