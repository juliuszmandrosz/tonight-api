import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPartnerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  partnerId: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accessCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  locale: string;
}
