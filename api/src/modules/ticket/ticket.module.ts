import { Module, ValidationPipe } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_PIPE } from '@nestjs/core';
import { UserUpdatedListener } from './listeners/user-updated.listener';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    TicketService,
    UserUpdatedListener,
  ],
  controllers: [TicketController],
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
  ],
})
export class TicketModule {}
