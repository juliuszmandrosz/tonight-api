import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  readonly discountId: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
