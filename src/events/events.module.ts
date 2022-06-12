import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [CoreModule],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
