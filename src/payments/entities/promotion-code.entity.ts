import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntity } from '@core/base-entity';
import { firestore } from 'firebase-admin';
import Timestamp = firestore.Timestamp;

export class PromotionCode extends BaseEntity {
  static parentCollectionName = 'users';
  static subCollectionName = 'promotionCodes';

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  amountOff: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  expirationDateTime: Timestamp;

  @IsBoolean()
  isValid: boolean;

  @IsNumber()
  @IsNotEmpty()
  maxRedemptions: number;

  @IsNumber()
  @IsNotEmpty()
  timesRedeemed: number;
}
