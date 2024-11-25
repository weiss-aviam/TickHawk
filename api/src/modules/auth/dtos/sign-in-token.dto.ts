import { Expose } from "class-transformer";

export class SignInTokenDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}