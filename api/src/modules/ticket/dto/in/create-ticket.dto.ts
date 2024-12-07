import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customerId: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  priority: string;
}