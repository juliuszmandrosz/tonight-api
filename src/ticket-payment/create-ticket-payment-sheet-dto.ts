import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTicketPaymentSheetDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsBoolean()
  isVip: boolean;

  @IsBoolean()
  sendInvoice: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  promotionCode?: string;
}
