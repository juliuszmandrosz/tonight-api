import { Module } from '@nestjs/common';
import { SelectorsAccessCodesService } from '@selectors-access-codes/selectors-access-codes.service';
import { CoreModule } from '@core/core.module';
import { SelectorsAccessCodesController } from '@selectors-access-codes/selectors-access-codes.controller';

@Module({
  imports: [CoreModule],
  controllers: [SelectorsAccessCodesController],
  providers: [SelectorsAccessCodesService],
})
export class SelectorsAccessCodesModule {}
