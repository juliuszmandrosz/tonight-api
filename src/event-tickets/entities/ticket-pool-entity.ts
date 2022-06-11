import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TicketPool {
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsBoolean()
  isCurrent: boolean;

  @IsNumber()
  @IsNotEmpty()
  poolNumber: number;

  @IsNumber()
  @IsNotEmpty()
  ticketPrice: number;

  @IsNumber()
  @IsNotEmpty()
  ticketQuantity: number;

  @IsNumber()
  @IsOptional()
  vipPrice?: number;

  @IsNumber()
  @IsOptional()
  ticketsSold? = 0;

  @IsBoolean()
  @IsOptional()
  isVipEnabled? = false;

  @IsBoolean()
  @IsOptional()
  isSoldOut? = false;
}
