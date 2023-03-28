import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddPartnerDto {
  @IsString()
  @IsNotEmpty()
  partnerId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  accessCode: string;

  @IsString()
  @IsNotEmpty()
  locale: string;
}
