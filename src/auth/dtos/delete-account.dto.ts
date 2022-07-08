import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accountId: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
