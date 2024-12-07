import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class SignInTokenDto {
  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;
}