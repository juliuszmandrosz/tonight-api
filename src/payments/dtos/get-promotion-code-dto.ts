import { IsNotEmpty, IsString } from 'class-validator';

export class GetPromotionCodeDto {
  @IsString()
  @IsNotEmpty()
  promotionCode: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
