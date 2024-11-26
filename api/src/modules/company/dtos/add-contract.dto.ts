import { IsNotEmpty, IsString } from 'class-validator';

export class AddContractDto {  
  @IsNotEmpty()
  @IsString()
  name: string;

  hours: number;

  @IsNotEmpty()
  type: string;

  startDate: Date;

  endDate: Date;

  @IsNotEmpty()
  @IsString()
  status: string;
}