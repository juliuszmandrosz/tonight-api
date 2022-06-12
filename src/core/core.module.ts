import { Module } from '@nestjs/common';
import { DataServicesModule } from '@data-services/data-services.module';
import { AppConfigModule } from '@config/app-config.module';

@Module({
  imports: [DataServicesModule, AppConfigModule],
  exports: [DataServicesModule, AppConfigModule],
})
export class CoreModule {}
