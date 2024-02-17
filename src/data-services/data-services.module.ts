import { Module } from '@nestjs/common';
import { FirestoreDataServicesModule } from '@data-services/firestore/firestore-data-services.module';
import { TypesenseDataServicesModule } from '@data-services/typesense/typesense-data-services.module';

@Module({
  imports: [FirestoreDataServicesModule, TypesenseDataServicesModule],
  exports: [FirestoreDataServicesModule, TypesenseDataServicesModule],
})
export class DataServicesModule {}
