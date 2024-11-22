import { IsDefined, IsEmail, IsNotEmpty } from "class-validator";

export class CustomerAuthDto {
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @IsNotEmpty()
  @IsDefined()
  password: string;
}