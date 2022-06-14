import { firestore } from 'firebase-admin';
import Timestamp = firestore.Timestamp;
import { BaseEntity } from '@core/base-entity';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class Ticket implements BaseEntity {
  static parentCollectionName = 'users';
  static subCollectionName = 'tickets';

  constructor(params: Partial<Ticket>) {
    Object.assign(this, params);
  }

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  clubId: string;

  @IsString()
  @IsNotEmpty()
  ticketPaymentId: string;

  @IsString()
  @IsNotEmpty()
  clubName: string;

  @IsString()
  @IsNotEmpty()
  eventName: string;

  @IsNotEmpty()
  eventStartDateTime: Timestamp;

  @IsNotEmpty()
  eventEndDateTime: Timestamp;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsBoolean()
  isVip: boolean;

  @IsBoolean()
  isExpired: boolean;

  @IsBoolean()
  isEventCanceled: boolean;

  @IsBoolean()
  isReturnable: boolean;

  @IsBoolean()
  isReturned: boolean;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  reviewId?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  vipPaymentId?: string;
}
