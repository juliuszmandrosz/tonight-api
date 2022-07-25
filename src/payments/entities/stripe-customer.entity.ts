import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '@core/base-entity';

export class StripeCustomer implements BaseEntity {
  static collectionName = 'stripeCustomers';

  constructor(params: Partial<StripeCustomer>) {
    Object.assign(this, params);
  }

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  setupSecret: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  vatNumber?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  paymentMethod?: string;
}
