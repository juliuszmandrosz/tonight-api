import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPromotionCodeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  promotionCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
