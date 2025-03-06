import { CompanyTicket } from "./ticket.model";
import { Department } from "./department.model";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'customer';
  lang: string;
  profileImage?: string;
  companyId?: string;
  company?: CompanyTicket;
  departmentIds?: string[];
  departments?: Department[];
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}