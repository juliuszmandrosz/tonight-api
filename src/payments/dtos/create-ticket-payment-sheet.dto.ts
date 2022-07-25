import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class CreateTicketPaymentSheetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isVip: boolean;

  @IsBoolean()
  @Optional()
  @ApiProperty()
  sendInvoice: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  promotionCode?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  ticketQuantity = 1;
}
