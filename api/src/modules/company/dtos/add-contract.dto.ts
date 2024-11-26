import { IsNotEmpty, IsString } from 'class-validator';

export class AddContractDto {
  @IsNotEmpty()
  @IsString()
  companyId: string;
  
  @IsNotEmpty()
  @IsString()
  name: string;

  hours: number;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  startDate: Date;

  endDate: Date;

  @IsNotEmpty()
  @IsString()
  status: string;
}