import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '@core/firebase-auth.guard';
import { ClubsService } from '@clubs/clubs.service';
import { GetClubsDto } from '@clubs/dtos/get-clubs.dto';

@UseGuards(FirebaseAuthGuard)
@Controller('clubs')
export class ClubsController {
  constructor(private clubsService: ClubsService) {}

  @Post('getClubs') getClubs(@Body() dto: GetClubsDto) {
    return this.clubsService.getClubs(dto);
  }
}
