import { Module } from '@nestjs/common';
import { AppConfigService } from '@config/app-config.service';

@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
