import { Injectable } from '@nestjs/common';
import { AlgoliaDataService } from '@data-services/algolia/algolia-data.service';
import { AlgoliaQueryDto } from '@core/algolia-query.dto';

@Injectable()
export class AlgoliaSearchService {
  constructor(private algoliaDataService: AlgoliaDataService) {}

  search(queryDto: AlgoliaQueryDto) {
    return this.algoliaDataService.indexes[queryDto.index].search({
      query: queryDto.query,
      pageSize: queryDto.pageSize,
      filterBy: queryDto.filterBy,
      pageNumber: queryDto.pageNumber,
      aroundLatLng: queryDto.aroundLatLng ? queryDto.aroundLatLng : undefined,
      aroundRadius: queryDto.aroundRadius ? queryDto.aroundRadius : undefined,
    });
  }
}
