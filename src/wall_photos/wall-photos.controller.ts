import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetEventsDto } from '@events/dtos/get-events.dto';
import { FirebaseAuthGuard } from '@core/firebase-auth.guard';
import { WallPhotosService } from './wall-photos.service';

@UseGuards(FirebaseAuthGuard)
@Controller('wallPhotos')
export class WallPhotosController {
  constructor(private wallPhotosService: WallPhotosService) {}

  @Post('getPhotos') getPhotos(@Body() dto: GetEventsDto) {
    return this.wallPhotosService.getPhotos(dto);
  }
}
