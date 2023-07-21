import { BaseEntity } from '@core/base-entity';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Partner implements BaseEntity {
  static collectionName = 'partners';

  constructor(params: Partial<Partner>) {
    Object.assign(this, params);
  }

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  clubId: string;

  @IsString()
  @IsOptional()
  connectedStripeAccountId?: string;
}
