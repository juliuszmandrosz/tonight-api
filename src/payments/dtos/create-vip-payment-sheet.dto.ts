import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateVipPaymentSheetDto {
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsBoolean()
  @Optional()
  sendInvoice: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  promotionCode?: string;
}
