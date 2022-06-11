import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { FirestoreRepositoriesModule } from '@firestore-repositories/firestore-repositories.module';

@Module({
  imports: [FirestoreRepositoriesModule],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
