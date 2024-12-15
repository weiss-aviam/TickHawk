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
import { FileTicket, FileTicketSchema } from './schemas/file-ticket.schema';
import { FileService } from '../file/file.service';
import { ReplyCommentCustomerTicketDto } from './dto/in/reply-comment-customer-ticket.dto';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { Event, EventSchema } from './schemas/event.schema';

@Injectable()
export class TicketService {
  private readonly companyModel: Model<CompanyTicket>;
  private readonly userTicketModel: Model<UserTicket>;
  private readonly departmentTicketModel: Model<DepartmentTicket>;
  private readonly fileTicketModel: Model<FileTicket>;
  private readonly commentTicketModel: Model<Comment>;
  private readonly eventTicketModel: Model<Event>;

  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
    private readonly departmentService: DepartmentService,
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {
    this.companyModel = mongoose.model(CompanyTicket.name, CompanyTicketSchema);
    this.userTicketModel = mongoose.model(UserTicket.name, UserTicketSchema);
    this.fileTicketModel = mongoose.model(FileTicket.name, FileTicketSchema);
    this.commentTicketModel = mongoose.model(Comment.name, CommentSchema);
    this.eventTicketModel = mongoose.model(Event.name, EventSchema);
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
    try {
      // Limit 3 files max
      if (createTicket.files.length > 3) {
        throw new HttpException('MAX_FILES_EXCEEDED', 400);
      }
      // Limit subject to 60 characters and content to 500 characters
      if (
        createTicket.subject.length > 60 ||
        createTicket.content.length > 500
      ) {
        throw new HttpException('MAX_CHARACTERS_EXCEEDED', 400);
      }
      // Check if the company exists
      const company = await this.companyService.getById(auth.companyId);
      if (!company) {
        throw new HttpException('COMPANY_NOT_FOUND', 404);
      }
      // Check if the user exists
      const user = await this.userService.findById(new Types.ObjectId(auth.id));
      if (!user) {
        throw new HttpException('USER_NOT_FOUND', 404);
      }
      // Check if the department exists
      const department = await this.departmentService.getById(
        createTicket.departmentId,
      );
      if (!department) {
        throw new HttpException('DEPARTMENT_NOT_FOUND', 404);
      }
      // Check if the files exist
      const files = await this.fileService.getFiles(createTicket.files);
      if (!files) {
        throw new HttpException('FILES_NOT_FOUND', 404);
      }

      // Create the ticket
      const ticket = new this.ticketModel({
        status: 'open',
        priority: createTicket.priority,
        company: plainToInstance(this.companyModel, company),
        customer: plainToInstance(this.userTicketModel, user),
        subject: createTicket.subject,
        content: createTicket.content,
        department: plainToInstance(this.departmentTicketModel, department),
        files: files.map((file) => plainToInstance(this.fileTicketModel, file)),
      });
      const newTicket = await ticket.save();
      await this.fileService.activeFiles(createTicket.files);
      return this.getCustomerTicketById(auth, newTicket._id.toString());
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('TICKET_NOT_CREATED', 500);
    }
  }

  /**
   * Reply to a ticket if you are a customer
   * @param auth The authenticated user
   * @param replyCommentCustomerTicketDto The reply to the ticket
   * @returns 
   */
  async replyToCustomerTicket(
    auth: AuthDto,
    replyCommentCustomerTicketDto: ReplyCommentCustomerTicketDto,
  ): Promise<TicketDto> {
    if (replyCommentCustomerTicketDto.files.length > 3) {
      throw new HttpException('MAX_FILES_EXCEEDED', 400);
    }

    if (replyCommentCustomerTicketDto.content.length > 500) {
      throw new HttpException('MAX_CHARACTERS_EXCEEDED', 400);
    }

    // Check if the user exists
    const user = await this.userService.findById(new Types.ObjectId(auth.id));
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', 404);
    }

    // Check if the files exist
    const files = await this.fileService.getFiles(
      replyCommentCustomerTicketDto.files,
    );
    if (!files) {
      throw new HttpException('FILES_NOT_FOUND', 404);
    }

    const ticket = await this.ticketModel.findById(
      replyCommentCustomerTicketDto._id,
    );

    // Check if open
    if (ticket.status !== 'open') {
      throw new HttpException('TICKET_NOT_OPEN', 400);
    }

    const comment = plainToInstance(this.commentTicketModel, {
      user: plainToInstance(this.userTicketModel, user),
      content: replyCommentCustomerTicketDto.content,
      files: files.map((file) => plainToInstance(this.fileTicketModel, file)),
    }) as any;

    ticket.comments.push(comment);

    const ticketSaved = await ticket.save();
    return this.getCustomerTicketById(auth, ticketSaved._id.toString());
  }

  /**
   * Close a ticket if you are a customer
   * @param auth  The authenticated user
   * @param id The ticket id
   * @returns 
   */
  async closeCustomerTicket(auth: AuthDto, id: string): Promise<TicketDto> {
    const ticket = await this.ticketModel.findOne({
      _id: new Types.ObjectId(id),
      'customer._id': new Types.ObjectId(auth.id),
    });

    if (!ticket) {
      throw new HttpException('TICKET_NOT_FOUND', 404);
    }

    // Is not cloed
    if (ticket.status === 'closed') {
      throw new HttpException('TICKET_ALREADY_CLOSED', 400);
    }

    const user = await this.userService.findById(new Types.ObjectId(auth.id));
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', 404);
    }
    // Create event
    const event = plainToInstance(this.eventTicketModel, {
        user: plainToInstance(this.userTicketModel, user),
        type: 'close',
    });

    ticket.events.push(event);

    ticket.status = 'closed';
    const ticketSaved = await ticket.save();
    return plainToInstance(TicketDto, ticketSaved.toJSON(), {
      excludeExtraneousValues: true,
    });
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

  /**
   * Get a ticket of the customer
   * @param auth
   * @param id
   * @returns
   */
  async getCustomerTicket(auth: AuthDto, id: string): Promise<TicketDto> {
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

  async downloadFile(auth: AuthDto, file: string) {
    const userId = auth.id;
    
    // Customer or agent id, and file id in files
    const ticket = await this.ticketModel.findOne({
      $and : [
        { $or: [{ 'customer._id': new Types.ObjectId(userId) }, { 'agent._id': new Types.ObjectId(userId) }] },
        { $or: [{ 'files': { $elemMatch: { _id: new Types.ObjectId(file) } } }, { 'comments.files': { $elemMatch: { _id: new Types.ObjectId(file) } } }] }
      ]
      
    });

    if (!ticket) {
      throw new HttpException('TICKET_NOT_FOUND', 404);
    }

    const fileTicket = await this.fileService.getFile(file);

    if (!fileTicket) {
      throw new HttpException('FILE_NOT_FOUND', 404);
    }

    return fileTicket;
  }

}
