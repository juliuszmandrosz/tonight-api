import { Body, Controller, Post } from '@nestjs/common';
import { CreateTicketPaymentSheetDto } from '@payments/dtos/create-ticket-payment-sheet-dto';
import { PaymentsService } from '@payments/payments.service';
import { PaymentSheet } from '@payments/interfaces/payment-sheet';

@Controller('payment')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Post('createTicketPaymentSheet')
  createTicketPaymentSheet(
    @Body() createTicketPaymentSheetDto: CreateTicketPaymentSheetDto,
  ): Promise<PaymentSheet> {
    return this.paymentService.createTicketPaymentSheet(
      createTicketPaymentSheetDto,
    );
  }
}
