import { Module } from '@nestjs/common';
import { TypesenseDataService } from './typesense-data.service';

@Module({
  providers: [TypesenseDataService],
  exports: [TypesenseDataService],
})
export class TypesenseDataServicesModule {}
