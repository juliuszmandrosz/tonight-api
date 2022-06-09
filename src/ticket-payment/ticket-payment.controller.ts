import { Body, Controller, Post } from '@nestjs/common';
import { CreateTicketPaymentSheetDto } from './create-ticket-payment-sheet-dto';

@Controller('ticket-payment')
export class TicketPaymentController {
  @Post()
  createTicketPaymentSheet(
    @Body() createTicketPaymentSheetDto: CreateTicketPaymentSheetDto,
  ) {
    return createTicketPaymentSheetDto.eventId;
  }
}
