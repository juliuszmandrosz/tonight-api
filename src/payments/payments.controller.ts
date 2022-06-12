import { Body, Controller, Post } from '@nestjs/common';
import { CreateTicketPaymentSheetDto } from '@payments/dtos/create-ticket-payment-sheet.dto';
import { PaymentsService } from '@payments/payments.service';
import { PaymentSheet } from '@payments/interfaces/payment.sheet.interface';
import { GetPromotionCodeDto } from '@payments/dtos/get-promotion-code.dto';
import { PromotionCode } from '@payments/entities/promotion-code.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Post('createTicketPaymentSheet')
  createTicketPaymentSheet(
    @Body() dto: CreateTicketPaymentSheetDto,
  ): Promise<PaymentSheet> {
    return this.paymentService.createTicketPaymentSheet(dto);
  }

  @Post('getPromotionCode')
  getPromotionCode(@Body() dto: GetPromotionCodeDto): Promise<PromotionCode> {
    return this.paymentService.getPromotionCode(dto);
  }
}
