import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerTicketDto {

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
  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  files: string[];
}