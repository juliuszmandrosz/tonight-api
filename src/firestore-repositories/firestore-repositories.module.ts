import { Module } from '@nestjs/common';
import { FirestoreRepositories } from '@firestore-repositories/firestore-repositories';

@Module({
  providers: [FirestoreRepositories],
  exports: [FirestoreRepositories],
})
export class FirestoreRepositoriesModule {}
