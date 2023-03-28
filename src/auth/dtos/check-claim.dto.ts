import { IsEmail, IsNotEmpty } from 'class-validator';

export class CheckClaimDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
