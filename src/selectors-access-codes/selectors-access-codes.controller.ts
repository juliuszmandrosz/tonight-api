import { Controller, Post } from '@nestjs/common';
import { SelectorsAccessCodesService } from '@selectors-access-codes/selectors-access-codes.service';
import { AuthService } from '@auth/auth.service';

@Controller('selectorsAccessCodes')
export class SelectorsAccessCodesController {
  constructor(
    private selectorsAccessCodesService: SelectorsAccessCodesService,
    private authService: AuthService,
  ) {}

  @Post('generateAccessCodeForSelector')
  generateAccessCodeForSelector() {}
}
