import { Body, Controller, Post } from '@nestjs/common';
import { CreateTicketPaymentSheetDto } from '@payments/dtos/create-ticket-payment-sheet-dto';
import { PaymentsService } from '@payments/payments.service';

@Controller('payment')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Post('createTicketPaymentSheet')
  createTicketPaymentSheet(
    @Body() createTicketPaymentSheetDto: CreateTicketPaymentSheetDto,
  ) {
    return this.paymentService.createTicketPaymentSheet(
      createTicketPaymentSheetDto,
    );
  }
}
