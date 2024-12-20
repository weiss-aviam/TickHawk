import { IsNotEmpty, IsString } from "class-validator";

export class CreateCustomerTicketDto {

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @IsNotEmpty()
  @IsString()
  priority: string;
}