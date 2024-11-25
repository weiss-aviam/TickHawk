import { Expose } from "class-transformer";

export class ProfileDto {
  @Expose()
  email: string;
  @Expose()
  lang: string;
  @Expose()
  role: string;
  @Expose()
  companyId: string;
  @Expose()
  departmentIds: string[];
}