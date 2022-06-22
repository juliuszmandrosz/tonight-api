import { IsNotEmpty, IsString } from 'class-validator';

export class CancelTicketReservationDto {
  @IsString()
  @IsNotEmpty()
  ticketPaymentSessionId: string;
}
