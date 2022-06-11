import { Module } from '@nestjs/common';
import { ClubsService } from '@clubs/clubs.service';

@Module({
  providers: [ClubsService],
  exports: [ClubsService],
})
export class ClubsModule {}
