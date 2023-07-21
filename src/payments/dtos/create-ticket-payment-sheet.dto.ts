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
  @Optional()
  @ApiProperty()
  sendInvoice: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  promotionCode?: string;
}
