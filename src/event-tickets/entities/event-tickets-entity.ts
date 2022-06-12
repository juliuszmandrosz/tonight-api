import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TicketPool } from '@event-tickets/entities/ticket-pool-entity';
import { TicketSales } from '@event-tickets/entities/ticket-sales-entity';
import { BaseEntity } from '@core/base-entity';

export class EventTickets implements BaseEntity {
  static parentCollectionName = 'clubs';
  static subCollectionName = 'eventTickets';

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  ticketQuantity: number;

  @IsBoolean()
  @IsOptional()
  isSoldOut = false;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested()
  ticketPools: TicketPool[];

  @IsNotEmpty()
  @ValidateNested()
  ticketSales: TicketSales;
}
