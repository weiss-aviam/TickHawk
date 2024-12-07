import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';
import { CreateCustomerTicketDto } from './dto/create-customer-ticket.dto';
import { Request } from 'express';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Roles } from 'src/config/guard/roles/roles.decorator';
import { ApiOperation } from '@nestjs/swagger';

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
  ) {
    const user = req.user;
    return this.ticketService.createCustomerTicket(user, createTicketDto);
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
}
