import { Body, Controller, Get, Param, Post, Query, Req, Res, StreamableFile, UseGuards } from '@nestjs/common';
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
    const user = req.user;
    return this.ticketService.createTicket(user, createTicketDto);
  }

  @Get('')
  @Roles(['admin', 'agent'])
  async getTickets(@Req() req: Request, @Query('page') page?: number) {
    const user = req.user;
    if (!page || page < 1) {
      page = 1;
    }
    return this.ticketService.getTickets(user, page);
  }

  /**  Customer and Agent Members **/
  @Get('file/:file')
  @Roles(['customer', 'agent'])
  @ApiOperation({ summary: 'Download a file from a ticket' })
  async downloadFile(@Req() req: Request, @Param('file') file: string): Promise<StreamableFile> {
    const user = req.user;
    const buffer = await this.ticketService.downloadFile(user, file);
    return new StreamableFile(buffer);
  }
}
