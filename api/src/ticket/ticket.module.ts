import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [TicketService],
  controllers: [TicketController],
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }], 'users'),
  ],
})
export class TicketModule {}
