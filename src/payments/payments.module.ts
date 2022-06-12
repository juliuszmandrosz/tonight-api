import { Module } from '@nestjs/common';
import { EventsModule } from '@events/events.module';
import { PaymentsController } from '@payments/payments.controller';
import { EventTicketsModule } from '@event-tickets/event-tickets.module';
import { PaymentsService } from '@payments/payments.service';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [EventsModule, EventTicketsModule, CoreModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
