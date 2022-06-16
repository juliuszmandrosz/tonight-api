import { Body, Controller, Post } from '@nestjs/common';
import { CheckClaimDto } from '@auth/dtos/check-claim.dto';
import { AuthService } from '@auth/auth.service';
import { AddUserDto } from '@auth/dtos/add-user.dto';
import { CheckIfPartnerCanSignUpDto } from '@auth/dtos/check-if-partner-can-sign-up.dto';
import { AddPartnerDto } from '@auth/dtos/add-partner.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('checkUserClaim')
  checkUserClaim(@Body() dto: CheckClaimDto): Promise<void> {
    return this.authService.checkIfUserCanSignIn(dto);
  }

  @Post('addUser')
  addUser(@Body() dto: AddUserDto): Promise<void> {
    return this.authService.addUser(dto);
  }

  @Post('checkIfPartnerCanSignIn')
  checkIfPartnerCanSignIn(@Body() dto: CheckClaimDto): Promise<void> {
    return this.authService.checkIfPartnerCanSignIn(dto);
  }

  @Post('checkIfPartnerCanSignUp')
  checkIfPartnerCanSignUp(
    @Body() dto: CheckIfPartnerCanSignUpDto,
  ): Promise<void> {
    return this.authService.checkIfPartnerCanSignUp(dto);
  }

  @Post('addPartner')
  addPartner(@Body() dto: AddPartnerDto): Promise<void> {
    return this.authService.addPartner(dto);
  }
}
