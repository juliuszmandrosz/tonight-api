import { Injectable } from '@nestjs/common';
import { TypesenseDataService } from '@data-services/typesense/typesense-data.service';
import { GetWallPhotosDto } from './dtos/get-wall-photos.dto';

@Injectable()
export class WallPhotosService {
  constructor(private typesenseDataService: TypesenseDataService) {}

  async getPhotos(dto: GetWallPhotosDto) {}
}
