import { Module } from '@nestjs/common';
import { ClubsService } from '@clubs/clubs.service';
import { TypesenseDataServicesModule } from '@data-services/typesense/typesense-data-services.module';
import { ClubsController } from '@clubs/clubs.controller';

@Module({
  imports: [TypesenseDataServicesModule],
  providers: [ClubsService],
  exports: [ClubsService],
  controllers: [ClubsController],
})
export class ClubsModule {}
