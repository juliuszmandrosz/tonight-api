import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';

@Module({
  imports: [CoreModule],
  controllers: [DiscountsController],
  providers: [DiscountsService],
})
export class DiscountsModule {}
