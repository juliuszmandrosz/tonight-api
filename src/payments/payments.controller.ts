import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateTicketPaymentSheetDto } from '@payments/dtos/create-ticket-payment-sheet.dto';
import { PaymentsService } from '@payments/payments.service';
import { PaymentSheet } from '@payments/interfaces/payment.sheet.interface';
import { FirebaseAuthGuard } from '@core/firebase-auth.guard';
import { EventFees } from '@payments/interfaces/event-fees.interface';
import { CancelTicketReservationDto } from '@payments/dtos/cancel-ticket-reservation.dto';

@UseGuards(FirebaseAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Post('createTicketPaymentSheet')
  createTicketPaymentSheet(
    @Body() dto: CreateTicketPaymentSheetDto,
  ): Promise<PaymentSheet> {
    return this.paymentService.createTicketPaymentSheet(dto);
  }

  @Post('cancelTicketReservation')
  cancelTicketReservation(
    @Body() dto: CancelTicketReservationDto,
  ): Promise<void> {
    return this.paymentService.cancelTicketReservation(dto);
  }

  @Get('getServiceFee')
  getServiceFee(): number {
    return this.paymentService.getServiceFee();
  }

  @Get('getEventFees')
  getEventFees(): EventFees {
    return this.paymentService.getEventFees();
  }
}
