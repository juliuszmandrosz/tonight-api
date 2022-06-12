import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '@core/base-entity';
import { v1 } from 'uuid';

export class StripeCustomer implements BaseEntity {
  static collectionName = 'stripeCustomers';

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string = v1();

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
}
