import { Body, Controller, Post } from '@nestjs/common';
import { CheckClaimDto } from '@auth/dtos/check-claim.dto';
import { AuthService } from '@auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('checkUserClaim')
  checkUserClaim(@Body() dto: CheckClaimDto): Promise<void> {
    return this.authService.checkUserClaim(dto);
  }
}
