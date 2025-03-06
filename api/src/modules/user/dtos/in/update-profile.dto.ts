import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {

  @IsNotEmpty()
  @IsString()
  _id: string;
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsOptional()
  password?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @IsIn(['en', 'es'])
  lang: string;
  
  @IsOptional()
  @IsString()
  @IsMongoId()
  @ApiProperty()
  profileImage?: string;
}
