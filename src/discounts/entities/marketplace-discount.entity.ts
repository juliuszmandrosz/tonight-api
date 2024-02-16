import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '@core/base-entity';
import { v1 } from 'uuid';

export class MarketplaceDiscount implements BaseEntity {
  static collectionName = 'marketplaceDiscounts';

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
  @IsNumber()
  /// Price in raver coins
  price: number;

  @IsNumber()
  @IsNotEmpty()
  priceRuleId: number;
}
