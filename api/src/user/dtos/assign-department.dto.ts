import { IsNotEmpty, IsString } from 'class-validator';

export class AssignDepartmentDto {
  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
