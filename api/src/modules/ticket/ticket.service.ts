import { HttpException, Injectable } from '@nestjs/common';
import { CreateCustomerTicketDto } from './dto/in/create-customer-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './schemas/ticket.schema';
import mongoose, { Model, Types } from 'mongoose';
import { DepartmentService } from '../department/department.service';
import { CompanyService } from '../company/company.service';
import {
  CompanyTicket,
  CompanyTicketSchema,
} from './schemas/company-ticket.schema';
import { plainToInstance } from 'class-transformer';
import { UserTicket, UserTicketSchema } from './schemas/user-ticket.schema';
import {
  DepartmentTicket,
  DepartmentTicketSchema,
} from './schemas/department-ticket.schema';
import { UserService } from '../user/user.service';
import { CreateTicketDto } from './dto/in/create-ticket.dto';
import { TicketDto } from './dto/out/ticket.dto';

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
    this.departmentTicketModel = mongoose.model(
      DepartmentTicket.name,
      DepartmentTicketSchema,
    );
  }

  /**
   * Create a new customer ticket
   * @param createTicket The ticket to create
   */
  async createCustomerTicket(
    auth: AuthDto,
    createTicket: CreateCustomerTicketDto,
  ): Promise<TicketDto> {
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

    return this.getCustomerTicketById(auth, newTicket._id.toString());
  }

  /**
   * Create a new ticket
   * @param auth  The authenticated user
   * @param createTicket The ticket to create
   * @returns
   */
  async createTicket(auth: AuthDto, createTicket: CreateTicketDto) {
    const company = await this.companyService.getById(auth.companyId);
    const agent = await this.userService.findById(new Types.ObjectId(auth.id));
    const user = await this.userService.findById(
      new Types.ObjectId(createTicket.customerId),
    );
    const department = await this.departmentService.getById(
      createTicket.departmentId,
    );

    const ticket = new this.ticketModel({
      status: createTicket.status,
      priority: createTicket.priority,
      company: plainToInstance(this.companyModel, company),
      agent: plainToInstance(this.userTicketModel, agent),
      customer: plainToInstance(this.userTicketModel, user),
      subject: createTicket.subject,
      content: createTicket.content,
      department: plainToInstance(this.departmentTicketModel, department),
    });

    const newTicket = await ticket.save();

    return this.getTicketById(auth, newTicket._id.toString());
  }

  /**
   * Get ticket by id for an agent
   * @param auth The authenticated user
   * @param id The ticket id
   * @returns TicketDto
   */
  async getTicketById(auth: AuthDto, id: string): Promise<TicketDto> {
    const ticket = await this.ticketModel.findOne({
      _id: new Types.ObjectId(id),
      'agent._id': new Types.ObjectId(auth.id),
    });

    if (!ticket) {
      throw new HttpException('TICKET_NOT_FOUND', 404);
    }

    return plainToInstance(TicketDto, ticket.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Get all tickets for an agent order by date created descending
   * @param auth
   * @param page
   */
  async getTickets(auth: AuthDto, page: number): Promise<TicketDto[]> {
    const limit = 15;
    const tickets = await this.ticketModel
      .find({
        'agent._id': new Types.ObjectId(auth.id),
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    return plainToInstance(
      TicketDto,
      tickets.map((ticket) => ticket.toJSON()),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  /**
   * Get ticket by id for a customer
   * @param auth The authenticated user
   * @param id The ticket id
   * @returns TicketDto
   */
  async getCustomerTicketById(auth: AuthDto, id: string): Promise<TicketDto> {
    const ticket = await this.ticketModel.findOne({
      _id: new Types.ObjectId(id),
      'customer._id': new Types.ObjectId(auth.id),
    });

    if (!ticket) {
      throw new HttpException('TICKET_NOT_FOUND', 404);
    }

    return plainToInstance(TicketDto, ticket.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Get all tickets for a customer order by date created descending
   * @param auth
   * @param id
   * @param page
   */
  async getCustomerTickets(auth: AuthDto, page: number): Promise<TicketDto[]> {
    const limit = 15;
    const tickets = await this.ticketModel
      .find({
        'customer._id': new Types.ObjectId(auth.id),
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    return plainToInstance(
      TicketDto,
      tickets.map((ticket) => ticket.toJSON()),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
