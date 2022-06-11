import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTicketPaymentSheetDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsBoolean()
  isVip: boolean;

  @IsBoolean()
  sendInvoice: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  promotionCode: string;
}
