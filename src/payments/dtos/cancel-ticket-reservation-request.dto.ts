import { IsNotEmpty, IsString } from 'class-validator';

export class CancelTicketReservationRequestDto {
  @IsString()
  @IsNotEmpty()
  ticketPaymentSessionId: string;
}
