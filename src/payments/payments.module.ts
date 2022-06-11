import { Module } from '@nestjs/common';
import { EventsModule } from '@events/events.module';
import { PaymentsController } from '@payments/payments.controller';
import { EventTicketsModule } from '@event-tickets/event-tickets.module';
import { FirestoreRepositoriesModule } from '@firestore-repositories/firestore-repositories.module';
import { PaymentsService } from '@payments/payments.service';

@Module({
  imports: [EventsModule, EventTicketsModule, FirestoreRepositoriesModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
