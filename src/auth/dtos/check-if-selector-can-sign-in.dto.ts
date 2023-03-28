import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckIfSelectorCanSignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  accessCode: string;
}
