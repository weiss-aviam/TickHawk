import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNotEmpty } from "class-validator";

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  password: string;
}