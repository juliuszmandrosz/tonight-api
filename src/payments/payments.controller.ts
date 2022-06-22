import { Body, Controller, Post } from '@nestjs/common';
import { CreateTicketPaymentSheetDto } from '@payments/dtos/create-ticket-payment-sheet.dto';
import { PaymentsService } from '@payments/payments.service';
import { PaymentSheet } from '@payments/interfaces/payment.sheet.interface';
import { CreateVipPaymentSheetDto } from '@payments/dtos/create-vip-payment-sheet.dto';
import { CancelTicketReservationDto } from '@payments/dtos/cancel-ticket-reservation.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Post('createTicketPaymentSheet')
  createTicketPaymentSheet(
    @Body() dto: CreateTicketPaymentSheetDto,
  ): Promise<PaymentSheet> {
    return this.paymentService.createTicketPaymentSheet(dto);
  }

  @Post('createVipPaymentSheet')
  createVipPaymentSheet(
    @Body() dto: CreateVipPaymentSheetDto,
  ): Promise<PaymentSheet> {
    return this.paymentService.createVipPaymentSheet(dto);
  }

  @Post('cancelTicketReservation')
  cancelTicketReservation(
    @Body() dto: CancelTicketReservationDto,
  ): Promise<void> {
    return this.paymentService.cancelTicketReservation(dto);
  }
}
