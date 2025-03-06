import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ExposeId } from "src/config/expose-id.decorator";

// Define a simple company DTO
class CompanyDto {
  @Expose()
  @ExposeId()
  @ApiProperty()
  _id: string;

  @Expose()
  @ApiProperty()
  name: string;
}

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
  @Type(() => CompanyDto)
  @ApiProperty({ type: CompanyDto })
  company?: CompanyDto;
  
  @Expose()
  @ApiProperty()
  departmentIds: string[];
}