import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  locale: string;
}
