import { Module } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [CoreModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
