import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateTicketPaymentSheetDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsBoolean()
  @IsOptional()
  isVip: boolean;

  @IsBoolean()
  @Optional()
  sendInvoice: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  promotionCode?: string;

  @IsNumber()
  @IsOptional()
  ticketQuantity = 1;
}
