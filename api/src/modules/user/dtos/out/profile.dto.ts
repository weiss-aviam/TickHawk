import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ProfileDto {
  @Expose()
  @ApiProperty()
  _id: string;
  @Expose()
  @ApiProperty()
  name: string;
  @Expose()
  @ApiProperty()
  email: string;
  @Expose()
  @ApiProperty()
  lang: string;
  @Expose()
  @ApiProperty()
  role: string;
  @Expose()
  @ApiProperty()
  companyId: string;
  @Expose()
  @ApiProperty()
  departmentIds: string[];
}