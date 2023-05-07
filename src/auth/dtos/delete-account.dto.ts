import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accountId: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email: string;
}
