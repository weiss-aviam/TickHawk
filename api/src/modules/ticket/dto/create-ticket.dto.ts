import { IsNotEmpty, IsString } from "class-validator";

export class CreateTicketDto {

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
  customerId: string;
  
  @IsNotEmpty()
  @IsString()
  status: string;
  
  @IsNotEmpty()
  @IsString()
  priority: string;
}