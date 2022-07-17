import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GooglePlacesService } from './google-places.service';
import { GetCitiesDto } from './dtos/get-cities.dto';
import { FirebaseAuthGuard } from '@core/firebase-auth.guard';
import { City } from '@google-places/interfaces/city.interface';

@UseGuards(FirebaseAuthGuard)
@Controller('googlePlaces')
export class GooglePlacesController {
  constructor(private googlePlacesService: GooglePlacesService) {}

  @Post('getCities')
  getCities(@Body() dto: GetCitiesDto): Promise<City[]> {
    return this.googlePlacesService.getCities(dto);
  }
}
