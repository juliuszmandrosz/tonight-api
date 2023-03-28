import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddSelectorDto {
  @IsString()
  @IsNotEmpty()
  selectorId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  accessCode: string;
}
