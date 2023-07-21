import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Stripe } from 'stripe';
import { firestore } from 'firebase-admin';
import { BaseEntity } from '@core/base-entity';
import Timestamp = firestore.Timestamp;

export class TicketPaymentSession implements BaseEntity {
  static collectionName = 'ticketPaymentSessions';

  constructor(params: Partial<TicketPaymentSession>) {
    Object.assign(this, params);
  }

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  stripeCustomerId: string;

  @IsString()
  @IsNotEmpty()
  connectedStripeAccountId: string;

  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsNumber()
  @IsNotEmpty()
  ticketQuantity: number;

  @IsString()
  @IsNotEmpty()
  status: Stripe.PaymentIntent.Status;

  @IsBoolean()
  @IsOptional()
  isRefunded = false;

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
