import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { CoreModule } from '@core/core.module';
import { TypesenseDataServicesModule } from '@data-services/typesense/typesense-data-services.module';
import { EventsController } from '@events/events.controller';

@Module({
  imports: [CoreModule, TypesenseDataServicesModule],
  providers: [EventsService],
  exports: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
