import { Module } from '@nestjs/common';
import { TicketPoolsService } from '@event-tickets/services/ticket-pools.service';
import { EventTicketsService } from '@event-tickets/services/event-tickets.service';
import { TicketSalesService } from '@event-tickets/services/ticket-sales.service';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [CoreModule],
  providers: [TicketSalesService, TicketPoolsService, EventTicketsService],
  exports: [EventTicketsService],
})
export class EventTicketsModule {}
