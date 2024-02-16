import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '@core/base-entity';
import { v1 } from 'uuid';
import { firestore } from 'firebase-admin';
import Timestamp = firestore.Timestamp;

export class UserMarketplaceDiscount implements BaseEntity {
  static parentCollectionName = 'users';
  static subCollectionName = 'marketplaceDiscounts';

  constructor(params: Partial<UserMarketplaceDiscount>) {
    Object.assign(this, params);
  }

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string = v1();

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsString()
  marketplaceUrl: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  redeemedAt: Timestamp;
}
