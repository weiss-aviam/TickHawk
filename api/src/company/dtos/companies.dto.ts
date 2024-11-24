import { Expose } from "class-transformer";

export class CompaniesDto {
  @Expose()
  name: string;

  @Expose()
  email: string;
}