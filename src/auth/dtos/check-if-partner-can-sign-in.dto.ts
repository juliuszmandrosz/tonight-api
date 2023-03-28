import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckIfPartnerCanSignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  accessCode: string;
}
