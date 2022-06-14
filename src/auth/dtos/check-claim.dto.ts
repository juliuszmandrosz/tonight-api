import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckClaimDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
