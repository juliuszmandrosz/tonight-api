import { Module } from '@nestjs/common';
import { FirestoreDataServicesModule } from '@data-services/firestore/firestore-data-services.module';

@Module({
  imports: [FirestoreDataServicesModule],
  exports: [FirestoreDataServicesModule],
})
export class DataServicesModule {}
