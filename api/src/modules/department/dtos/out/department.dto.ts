import { Expose } from 'class-transformer';
import { ExposeId } from 'src/config/expose-id.decorator';

export class DepartmentDto {
  @Expose()
  @ExposeId()
  _id: string;

  @Expose()
  name: string;
}
