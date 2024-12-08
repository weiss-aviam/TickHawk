import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { ExposeId } from "src/config/expose-id.decorator";

export class ProfileDto {
  @Expose()
  @ExposeId()
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