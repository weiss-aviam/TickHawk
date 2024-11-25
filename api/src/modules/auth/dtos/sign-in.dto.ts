import { IsDefined, IsEmail, IsNotEmpty } from "class-validator";

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @IsNotEmpty()
  @IsDefined()
  password: string;
}