import { Module } from '@nestjs/common';
import { FirestoreDataService } from './firestore-data.service';

@Module({
  providers: [FirestoreDataService],
  exports: [FirestoreDataService],
})
export class FirestoreDataServicesModule {}
