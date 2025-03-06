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
import { UpdateTicketStatusDto } from './dto/in/update-ticket-status.dto';
import { AssignAgentDto } from './dto/in/assign-agent.dto';
import { AgentReplyTicketDto } from './dto/in/agent-reply-ticket.dto';

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
        content_user: plainToInstance(this.userTicketModel, user), // Añadimos el usuario completo que escribió el contenido
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
    try {
      // Validate required fields
      if (!createTicket.subject || !createTicket.content || !createTicket.departmentId || 
          !createTicket.customerId || !createTicket.status || !createTicket.priority) {
        throw new HttpException('Missing required fields', 400);
      }
      
      // Auth es el agente o administrador que está creando el ticket
      const agent = await this.userService.findById(new Types.ObjectId(auth.id));
      if (!agent) {
        throw new HttpException('Agent not found', 404);
      }
      
      // Obtener la información del customer para quien se está creando el ticket
      const customer = await this.userService.findById(
        new Types.ObjectId(createTicket.customerId),
      );
      if (!customer) {
        throw new HttpException('Customer not found', 404);
      }
      
      // Obtener la información de la compañía del customer
      if (!customer.companyId) {
        throw new HttpException('Customer has no company assigned', 400);
      }
      
      const customerCompanyId = customer.companyId.toString();
      const company = await this.companyService.getById(customerCompanyId);
      if (!company) {
        throw new HttpException('Customer company not found', 404);
      }
      
      // Obtener el departamento
      const department = await this.departmentService.getById(
        createTicket.departmentId,
      );
      if (!department) {
        throw new HttpException('Department not found', 404);
      }
      
      const ticket = new this.ticketModel({
        status: createTicket.status,
        priority: createTicket.priority,
        company: plainToInstance(this.companyModel, company),
        //agent: plainToInstance(this.userTicketModel, agent),
        customer: plainToInstance(this.userTicketModel, customer),
        subject: createTicket.subject,
        content: createTicket.content,
        content_user: plainToInstance(this.userTicketModel, agent), // Usuario completo que creó el ticket
        department: plainToInstance(this.departmentTicketModel, department),
      });
  
      const newTicket = await ticket.save();
  
      return this.getTicketById(auth, newTicket._id.toString());
    } catch (error) {
      console.error('Error in createTicket service:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(`Failed to create ticket: ${error.message}`, 500);
    }
  }

  /**
   * Get ticket by id for an agent or admin
   * @param auth The authenticated user
   * @param id The ticket id
   * @returns TicketDto
   */
  async getTicketById(auth: AuthDto, id: string): Promise<TicketDto> {
    // Build query based on role
    const query: any = {
      _id: new Types.ObjectId(id)
    };
    
    // If agent, only show tickets assigned to them
    if (auth.role === 'agent') {
      query['agent._id'] = new Types.ObjectId(auth.id);
    }

    const ticket = await this.ticketModel.findOne(query);

    if (!ticket) {
      throw new HttpException('TICKET_NOT_FOUND', 404);
    }

    return plainToInstance(TicketDto, ticket.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Get all tickets for an agent order by date created descending
   * @param auth Authenticated user
   * @param page Page number
   * @param departmentId Optional department ID to filter by
   * @param companyId Optional company ID to filter by
   */
  async getTickets(
    auth: AuthDto, 
    page: number, 
    departmentId?: string, 
    companyId?: string
  ): Promise<TicketDto[]> {
    const limit = 15;
    
    // Build the query based on user role and filters
    const query: any = {};
    
    // For agents, only show tickets assigned to them
    if (auth.role === 'agent') {
      query['agent._id'] = new Types.ObjectId(auth.id);
    }
    
    // Apply filters if provided
    if (departmentId) {
      query['department._id'] = new Types.ObjectId(departmentId);
    }
    
    if (companyId) {
      query['company._id'] = new Types.ObjectId(companyId);
    }

    const tickets = await this.ticketModel
      .find(query)
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
    const limit = 10;
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
      $and: [
        {
          $or: [
            { 'customer._id': new Types.ObjectId(userId) },
            { 'agent._id': new Types.ObjectId(userId) },
          ],
        },
        {
          $or: [
            { files: { $elemMatch: { _id: new Types.ObjectId(file) } } },
            {
              'comments.files': {
                $elemMatch: { _id: new Types.ObjectId(file) },
              },
            },
          ],
        },
      ],
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

  /**
   * Update the status of a ticket
   * @param auth The authenticated user (admin or agent)
   * @param id The ticket ID
   * @param updateStatusDto The new status
   * @returns Updated ticket
   */
  async updateTicketStatus(
    auth: AuthDto, 
    id: string, 
    updateStatusDto: UpdateTicketStatusDto
  ): Promise<TicketDto> {
    // Build query based on role
    const query: any = {
      _id: new Types.ObjectId(id)
    };
    
    // If agent, only allow updating tickets assigned to them
    if (auth.role === 'agent') {
      query['agent._id'] = new Types.ObjectId(auth.id);
    }

    const ticket = await this.ticketModel.findOne(query);

    if (!ticket) {
      throw new HttpException('TICKET_NOT_FOUND', 404);
    }

    // Don't allow updating if ticket is already closed
    if (ticket.status === 'closed') {
      throw new HttpException('TICKET_ALREADY_CLOSED', 400);
    }

    // Don't do anything if status is the same
    if (ticket.status === updateStatusDto.status) {
      return plainToInstance(TicketDto, ticket.toJSON(), {
        excludeExtraneousValues: true,
      });
    }

    // Get user data for the event
    const user = await this.userService.findById(new Types.ObjectId(auth.id));
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', 404);
    }

    // Create event to track status change
    const event = plainToInstance(this.eventTicketModel, {
      user: plainToInstance(this.userTicketModel, user),
      type: 'status-change',
      data: {
        oldStatus: ticket.status,
        newStatus: updateStatusDto.status
      }
    });

    // Update ticket status and add event
    ticket.status = updateStatusDto.status;
    ticket.events.push(event);
    const updatedTicket = await ticket.save();

    return plainToInstance(TicketDto, updatedTicket.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Assign a ticket to a different agent
   * @param auth The authenticated user (admin or agent)
   * @param id The ticket ID
   * @param assignAgentDto Contains the ID of the agent to assign
   * @returns Updated ticket
   */
  async assignTicketToAgent(
    auth: AuthDto, 
    id: string, 
    assignAgentDto: AssignAgentDto
  ): Promise<TicketDto> {
    // Build query based on role
    const query: any = {
      _id: new Types.ObjectId(id)
    };
    
    // If agent, only allow transferring tickets assigned to them
    if (auth.role === 'agent') {
      query['agent._id'] = new Types.ObjectId(auth.id);
    }

    const ticket = await this.ticketModel.findOne(query);

    if (!ticket) {
      throw new HttpException('TICKET_NOT_FOUND', 404);
    }

    // Don't allow updating if ticket is closed
    if (ticket.status === 'closed') {
      throw new HttpException('TICKET_ALREADY_CLOSED', 400);
    }

    // Get the new agent data
    const newAgent = await this.userService.findById(
      new Types.ObjectId(assignAgentDto.agentId)
    );
    
    if (!newAgent) {
      throw new HttpException('AGENT_NOT_FOUND', 404);
    }

    // Verify the agent has the right role
    if (newAgent.role !== 'agent' && newAgent.role !== 'admin') {
      throw new HttpException('INVALID_AGENT_ROLE', 400);
    }

    // Get current user data for the event
    const currentUser = await this.userService.findById(new Types.ObjectId(auth.id));
    if (!currentUser) {
      throw new HttpException('USER_NOT_FOUND', 404);
    }

    // Store old agent info for the event
    const oldAgent = ticket.agent ? { 
      _id: ticket.agent._id,
      name: ticket.agent.name 
    } : null;

    // Create event to track agent assignment
    const event = plainToInstance(this.eventTicketModel, {
      user: plainToInstance(this.userTicketModel, currentUser),
      type: 'assign-agent',
      data: {
        oldAgent: oldAgent,
        newAgent: {
          _id: newAgent._id,
          name: newAgent.name
        }
      }
    });

    // Update ticket agent and add event
    ticket.agent = plainToInstance(this.userTicketModel, newAgent);
    ticket.events.push(event);
    const updatedTicket = await ticket.save();

    return plainToInstance(TicketDto, updatedTicket.toJSON(), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Reply to a ticket as an agent or admin
   * @param auth The authenticated user (agent or admin)
   * @param agentReplyDto The reply information
   * @returns Updated ticket
   */
  async replyToTicketAsAgent(
    auth: AuthDto,
    agentReplyDto: AgentReplyTicketDto,
  ): Promise<TicketDto> {
    // Verify max files
    if (agentReplyDto.files.length > 3) {
      throw new HttpException('MAX_FILES_EXCEEDED', 400);
    }

    // Verify content length
    if (agentReplyDto.content.length > 500) {
      throw new HttpException('MAX_CHARACTERS_EXCEEDED', 400);
    }

    // Build query based on role
    const query: any = {
      _id: new Types.ObjectId(agentReplyDto._id)
    };
    
    // If agent, only allow replying to tickets assigned to them
    if (auth.role === 'agent') {
      query['agent._id'] = new Types.ObjectId(auth.id);
    }

    const ticket = await this.ticketModel.findOne(query);

    if (!ticket) {
      throw new HttpException('TICKET_NOT_FOUND', 404);
    }

    // Don't allow replying if ticket is closed
    if (ticket.status === 'closed') {
      throw new HttpException('TICKET_ALREADY_CLOSED', 400);
    }

    // Check if the user exists
    const user = await this.userService.findById(new Types.ObjectId(auth.id));
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', 404);
    }

    // Check if the files exist
    const files = await this.fileService.getFiles(
      agentReplyDto.files,
    );
    if (!files) {
      throw new HttpException('FILES_NOT_FOUND', 404);
    }

    // Create the comment with the current user as the commenter
    const comment = plainToInstance(this.commentTicketModel, {
      user: plainToInstance(this.userTicketModel, user),
      content: agentReplyDto.content,
      files: files.map((file) => plainToInstance(this.fileTicketModel, file)),
    }) as any;

    ticket.comments.push(comment);

    const ticketSaved = await ticket.save();
    return this.getTicketById(auth, ticketSaved._id.toString());
  }
}
