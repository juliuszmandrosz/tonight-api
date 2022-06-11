import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TicketSales {
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  @IsNotEmpty()
  eventFee: number;

  @IsNumber()
  @IsOptional()
  totalRevenue = 0;

  @IsNumber()
  @IsOptional()
  clubIncome = 0;

  @IsNumber()
  @IsOptional()
  ticketsSold = 0;

  @IsNumber()
  @IsOptional()
  vipsSold = 0;

  @IsBoolean()
  @IsOptional()
  isExclusiveEvent = false;
}
