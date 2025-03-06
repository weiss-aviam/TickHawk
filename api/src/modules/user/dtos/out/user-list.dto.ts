import { Expose, Type } from 'class-transformer';
import { ProfileDto } from './profile.dto';

export class UserListDto {
  @Expose()
  @Type(() => ProfileDto)
  users: ProfileDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;
}