import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class DeleteAccountDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
