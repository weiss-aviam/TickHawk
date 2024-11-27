import { Injectable } from '@nestjs/common';
import { CreateCustomerTicketDto } from './dto/create-customer-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './schemas/ticket.schema';
import mongoose, { Model, Types } from 'mongoose';
import { DepartmentService } from '../department/department.service';
import { CompanyService } from '../company/company.service';
import { CompanyTicket, CompanyTicketSchema } from './schemas/company-ticket.schema';
import { plainToInstance } from 'class-transformer';
import { UserTicket, UserTicketSchema } from './schemas/user-ticket.schema';
import { DepartmentTicket, DepartmentTicketSchema } from './schemas/department-ticket.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class TicketService {
    private readonly companyModel: Model<CompanyTicket>;
    private readonly userTicketModel: Model<UserTicket>;
    private readonly departmentTicketModel: Model<DepartmentTicket>;

  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
    private readonly departmentService: DepartmentService,
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
  ) {
    this.companyModel = mongoose.model(CompanyTicket.name, CompanyTicketSchema);
    this.userTicketModel = mongoose.model(UserTicket.name, UserTicketSchema);
    this.departmentTicketModel = mongoose.model(DepartmentTicket.name, DepartmentTicketSchema);
  }

  /**
   * Create a new customer ticket
   * @param createTicket The ticket to create
   */
  async createCustomerTicket(auth: AuthDto, createTicket: CreateCustomerTicketDto) {
    const company = await this.companyService.getById(auth.companyId);
    const user = await this.userService.findById(new Types.ObjectId(auth.id));
    const department = await this.departmentService.getById(
      createTicket.departmentId,
    );
    
    const ticket = new this.ticketModel({
      status: 'open',
      priority: 'low',
      company: plainToInstance(this.companyModel, company),
      customer: plainToInstance(this.userTicketModel, user),
      subject: createTicket.subject,
      content: createTicket.content,
      department: plainToInstance(this.departmentTicketModel, department),
    });
    const newTicket = await ticket.save();

    return newTicket.toJSON()._id;
  }
}
