import { firestore } from 'firebase-admin';
import Timestamp = firestore.Timestamp;
import { Stripe } from 'stripe';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class VipPaymentSession {
  static collectionName = 'vipPaymentSessions';

  constructor(params: Partial<VipPaymentSession>) {
    Object.assign(this, params);
  }

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string;

  @IsNotEmpty()
  @IsString()
  ticketId: string;

  @IsNotEmpty()
  @IsString()
  eventId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  stripeCustomerId: string;

  @IsNotEmpty()
  @IsString()
  status: Stripe.PaymentIntent.Status;

  @IsNumber()
  @IsNotEmpty()
  revenue: number;

  @IsNumber()
  @IsNotEmpty()
  serviceFeeAmount: number;

  @IsNumber()
  @IsNotEmpty()
  promotionCodeAmountOff: number;

  @IsBoolean()
  @IsOptional()
  isRefunded = false;

  @IsBoolean()
  @IsOptional()
  sendInvoice = false;

  @IsOptional()
  paymentDateTime?: Timestamp;

  @IsString()
  @IsOptional()
  promotionCode?: string;
}
