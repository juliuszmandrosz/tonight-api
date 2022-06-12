import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Stripe } from 'stripe';
import { firestore } from 'firebase-admin';
import Timestamp = firestore.Timestamp;
import { BaseEntity } from '@core/base-entity';
import { v1 } from 'uuid';

export class TicketPaymentSession implements BaseEntity {
  static collectionName = 'ticketPaymentSessions';

  constructor(params: Partial<TicketPaymentSession>) {
    Object.assign(this, params);
  }

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string = v1();

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  stripeCustomerId: string;

  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  status: Stripe.PaymentIntent.Status;

  @IsBoolean()
  isVip: boolean;

  @IsString()
  @IsNotEmpty()
  cancelTicketReservationTaskId: string;

  @IsBoolean()
  isRefunded: boolean;

  @IsNumber()
  @IsNotEmpty()
  revenue: number;

  @IsNumber()
  @IsNotEmpty()
  serviceFeeAmount: number;

  @IsBoolean()
  sendInvoice: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  promotionCode?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ticketId?: string;

  @IsNotEmpty()
  @IsOptional()
  paymentDateTime?: Timestamp;

  @IsNumber()
  @IsOptional()
  promotionCodeAmountOff = 0;
}
