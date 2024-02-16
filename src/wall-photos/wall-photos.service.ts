import { Injectable } from '@nestjs/common';
import { TypesenseDataService } from '@data-services/typesense/typesense-data.service';
import { GetWallPhotosDto } from './dtos/get-wall-photos.dto';

@Injectable()
export class WallPhotosService {
  constructor(private typesenseDataService: TypesenseDataService) {}

  async getPhotos(dto: GetWallPhotosDto) {
    return this.typesenseDataService.wallPhotos.retrieve({
      query: dto.query,
      queryBy: dto.queryBy,
      filterBy: dto.filterBy,
      pageNumber: dto.pageNumber,
      pageSize: dto.pageSize,
      sortBy: dto.sortBy,
    });
  }
}
