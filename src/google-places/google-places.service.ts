import { Inject, Injectable } from '@nestjs/common';
import { GetCitiesDto } from './dtos/get-cities.dto';
import { GooglePlacesProvider } from './google-places-providers';
import { GooglePlaces } from 'google-places-web';

@Injectable()
export class GooglePlacesService {
  constructor(
    @Inject(GooglePlacesProvider) private googlePlaces: GooglePlaces,
  ) {}

  async getCities(dto: GetCitiesDto) {
    const result = await this.googlePlaces.autocomplete({
      input: dto.query,
      types: ['(cities)'],
      language: dto.locale,
      components: 'country:pl',
    });

    return result.predictions.map((place) => place.description.split(',')[0]);
  }
}
