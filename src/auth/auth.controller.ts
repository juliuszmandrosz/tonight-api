import { Body, Controller, Post } from '@nestjs/common';
import { CheckClaimDto } from '@auth/dtos/check-claim.dto';
import { AuthService } from '@auth/auth.service';
import { AddUserDto } from '@auth/dtos/add-user.dto';
import { CheckIfPartnerCanSignUpDto } from '@auth/dtos/check-if-partner-can-sign-up.dto';
import { AddPartnerDto } from '@auth/dtos/add-partner.dto';
import { CheckIfSelectorCanSignUpDto } from '@auth/dtos/check-if-selector-can-sign-up.dto';
import { AddSelectorDto } from '@auth/dtos/add-selector.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('checkIfUserCanSignIn')
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

  @Post('checkIfSelectorCanSignIn')
  checkIfSelectorCanSignIn(@Body() dto: CheckClaimDto): Promise<void> {
    return this.authService.checkIfSelectorCanSignIn(dto);
  }

  @Post('checkIfSelectorCanSignUp')
  checkIfSelectorCanSignUp(
    @Body() dto: CheckIfSelectorCanSignUpDto,
  ): Promise<void> {
    return this.authService.checkIfSelectorCanSignUp(dto);
  }

  @Post('addSelector')
  addSelector(@Body() dto: AddSelectorDto): Promise<void> {
    return this.authService.addSelector(dto);
  }
}
