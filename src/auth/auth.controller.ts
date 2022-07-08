import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CheckClaimDto } from '@auth/dtos/check-claim.dto';
import { AuthService } from '@auth/auth.service';
import { AddUserDto } from '@auth/dtos/add-user.dto';
import { CheckIfPartnerCanSignInDto } from '@auth/dtos/check-if-partner-can-sign-in.dto';
import { AddPartnerDto } from '@auth/dtos/add-partner.dto';
import { CheckIfSelectorCanSignInDto } from '@auth/dtos/check-if-selector-can-sign-in.dto';
import { AddSelectorDto } from '@auth/dtos/add-selector.dto';
import { FirebaseAuthGuard } from '@core/firebase-auth.guard';
import { DeleteAccountDto } from '@auth/dtos/delete-account.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('checkIfUserCanSignIn')
  checkUserClaim(@Body() dto: CheckClaimDto): Promise<void> {
    return this.authService.checkIfUserCanSignIn(dto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('addUser')
  addUser(@Body() dto: AddUserDto): Promise<void> {
    return this.authService.addUser(dto);
  }

  @Post('checkIfPartnerCanSignIn')
  checkIfPartnerCanSignIn(
    @Body() dto: CheckIfPartnerCanSignInDto,
  ): Promise<void> {
    return this.authService.checkIfPartnerCanSignIn(dto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('addPartner')
  addPartner(@Body() dto: AddPartnerDto): Promise<void> {
    return this.authService.addPartner(dto);
  }

  @Post('checkIfSelectorCanSignIn')
  checkIfSelectorCanSignIn(
    @Body() dto: CheckIfSelectorCanSignInDto,
  ): Promise<void> {
    return this.authService.checkIfSelectorCanSignIn(dto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('addSelector')
  addSelector(@Body() dto: AddSelectorDto): Promise<void> {
    return this.authService.addSelector(dto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('deleteAccount')
  deleteAccount(@Body() dto: DeleteAccountDto): Promise<void> {
    return this.authService.deleteAccount(dto);
  }
}
