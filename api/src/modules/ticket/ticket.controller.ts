import { Body, Controller, Get, Param, Patch, Post, Query, Req, StreamableFile, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';
import { CreateCustomerTicketDto } from './dto/in/create-customer-ticket.dto';
import { Request } from 'express';
import { CreateTicketDto } from './dto/in/create-ticket.dto';
import { Roles } from 'src/config/guard/roles/roles.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { TicketDto } from './dto/out/ticket.dto';
import { ReplyCommentCustomerTicketDto } from './dto/in/reply-comment-customer-ticket.dto';
import { UpdateTicketStatusDto } from './dto/in/update-ticket-status.dto';
import { AssignAgentDto } from './dto/in/assign-agent.dto';
import { AgentReplyTicketDto } from './dto/in/agent-reply-ticket.dto';

@Controller('ticket')
@UseGuards(JWTGuard, RolesGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('customer')
  @Roles(['customer'])
  @ApiOperation({ summary: 'Create a new ticket if you are a customer' })
  async createCustomerTicket(
    @Body() createTicketDto: CreateCustomerTicketDto,
    @Req() req: Request,
  ): Promise<TicketDto> {
    const user = req.user;
    return await this.ticketService.createCustomerTicket(user, createTicketDto);
  }

  @Post('customer/reply')
  @Roles(['customer'])
  @ApiOperation({ summary: 'Reply to a ticket if you are a customer' })
  async replyToTicket(
    @Body() replyToCustomerTicket: ReplyCommentCustomerTicketDto,
    @Req() req: Request,
  ): Promise<TicketDto> {
    const user = req.user;
    return await this.ticketService.replyToCustomerTicket(user, replyToCustomerTicket);
  }

  @Post('customer/close/:id')
  @Roles(['customer'])
  @ApiOperation({ summary: 'Close a ticket if you are a customer' })
  async closeTicket(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<TicketDto> {
    const user = req.user;
    return await this.ticketService.closeCustomerTicket(user, id);
  }

  @Get('customer')
  @Roles(['customer'])
  @ApiOperation({ summary: 'Get all tickets of the customer' })
  async getCustomerTickets(@Req() req: Request, @Query('page') page?: number) {
    const user = req.user;
    if (!page || page < 1) {
      page = 1;
    }
    return this.ticketService.getCustomerTickets(user, page);
  }

  @Get('customer/:id')
  @Roles(['customer'])
  @ApiOperation({ summary: 'Get a ticket of the customer' })
  async getCustomerTicket(@Req() req: Request, @Param('id') id: string) {
    const user = req.user;
    return this.ticketService.getCustomerTicket(user, id);
  }

  /** ADMIN and AGENT **/
  @Post('')
  @Roles(['admin', 'agent'])
  async createTicket(
    @Body() createTicketDto: CreateTicketDto,
    @Req() req: Request,
  ) {
    try {
      const user = req.user;
      return await this.ticketService.createTicket(user, createTicketDto);
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }

  @Get('company')
  @Roles(['customer', 'admin', 'agent'])
  @ApiOperation({ summary: 'Get tickets by company with date filtering for reports' })
  async getTicketsByCompanyWithDateFilter(
    @Req() req: Request, 
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('companyId') companyId?: string,
    @Query('page') page?: number
  ) {
    const user = req.user;
    if (!page || page < 1) {
      page = 1;
    }
    return this.ticketService.getTicketsByCompanyWithDateFilter(user, startDate, endDate, page, companyId);
  }

  @Get('')
  @Roles(['admin', 'agent'])
  @ApiOperation({ summary: 'Get tickets with optional department and company filters' })
  async getTickets(
    @Req() req: Request, 
    @Query('page') page?: number,
    @Query('departmentId') departmentId?: string,
    @Query('companyId') companyId?: string
  ) {
    const user = req.user;
    if (!page || page < 1) {
      page = 1;
    }
    return this.ticketService.getTickets(user, page, departmentId, companyId);
  }
  
  /**  Customer and Agent Members **/
  @Get('file/:file')
  @Roles(['customer', 'agent', 'admin'])
  @ApiOperation({ summary: 'Download a file from a ticket' })
  async downloadFile(@Req() req: Request, @Param('file') file: string): Promise<StreamableFile> {
    const user = req.user;
    const buffer = await this.ticketService.downloadFile(user, file);
    
    return new StreamableFile(buffer);
  }
  
  @Get(':id')
  @Roles(['admin', 'agent'])
  @ApiOperation({ summary: 'Get a specific ticket by ID' })
  async getTicket(@Req() req: Request, @Param('id') id: string) {
    const user = req.user;
    return this.ticketService.getTicketById(user, id);
  }

  @Patch(':id/status')
  @Roles(['admin', 'agent'])
  @ApiOperation({ summary: 'Update ticket status' })
  async updateTicketStatus(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTicketStatusDto
  ): Promise<TicketDto> {
    const user = req.user;
    return await this.ticketService.updateTicketStatus(user, id, updateStatusDto);
  }

  @Patch(':id/assign')
  @Roles(['admin', 'agent'])
  @ApiOperation({ summary: 'Assign ticket to an agent' })
  async assignTicket(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() assignAgentDto: AssignAgentDto
  ): Promise<TicketDto> {
    const user = req.user;
    return await this.ticketService.assignTicketToAgent(user, id, assignAgentDto);
  }

  @Post('reply')
  @Roles(['admin', 'agent'])
  @ApiOperation({ summary: 'Reply to a ticket as an agent or admin' })
  async replyToTicketAsAgent(
    @Body() agentReplyDto: AgentReplyTicketDto,
    @Req() req: Request,
  ): Promise<TicketDto> {
    const user = req.user;
    return await this.ticketService.replyToTicketAsAgent(user, agentReplyDto);
  }

}
