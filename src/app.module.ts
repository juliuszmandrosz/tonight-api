import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketPaymentController } from './ticket-payment/ticket-payment.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, TicketPaymentController],
  providers: [AppService],
})
export class AppModule {}
