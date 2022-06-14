import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class CreateVipPaymentSheetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ticketId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsBoolean()
  @Optional()
  @ApiProperty()
  sendInvoice: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  promotionCode?: string;
}
