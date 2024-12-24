import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileDto {

  @IsNotEmpty()
  @IsString()
  _id: string;
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @IsIn(['en', 'es'])
  lang: string;
}
