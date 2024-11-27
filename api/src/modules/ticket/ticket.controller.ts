import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';
import { CreateCustomerTicketDto } from './dto/create-customer-ticket.dto';
import { Request } from 'express';

@Controller('ticket')
@UseGuards(JWTGuard, RolesGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('customer')
  async createTicket(
    @Body() createTicketDto: CreateCustomerTicketDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    return this.ticketService.createCustomerTicket(user, createTicketDto);
  }
}
