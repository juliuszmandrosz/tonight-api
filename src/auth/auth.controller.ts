import { Body, Controller, Post } from '@nestjs/common';
import { CheckClaimDto } from '@auth/dtos/check-claim.dto';
import { AuthService } from '@auth/auth.service';
import { AddUserDto } from '@auth/dtos/add-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('checkUserClaim')
  checkUserClaim(@Body() dto: CheckClaimDto): Promise<void> {
    return this.authService.checkUserClaim(dto);
  }

  @Post('addUser')
  addUser(@Body() dto: AddUserDto): Promise<void> {
    return this.authService.addUser(dto);
  }
}
