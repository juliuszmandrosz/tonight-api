import { Module } from '@nestjs/common';
import { ClubsService } from '@clubs/clubs.service';
import { ClubsController } from '@clubs/clubs.controller';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [CoreModule],
  providers: [ClubsService],
  exports: [ClubsService],
  controllers: [ClubsController],
})
export class ClubsModule {}
