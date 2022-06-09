import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketPaymentController } from './ticket-payment/ticket-payment.controller';

@Module({
  imports: [],
  controllers: [AppController, TicketPaymentController],
  providers: [AppService],
})
export class AppModule {}
