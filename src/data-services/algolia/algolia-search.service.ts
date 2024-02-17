import { Injectable } from '@nestjs/common';
import { AlgoliaDataService } from '@data-services/algolia/algolia-data.service';
import { AlgoliaQueryDto } from '@core/algolia-query.dto';

@Injectable()
export class AlgoliaSearchService {
  constructor(private algoliaDataService: AlgoliaDataService) {}

  search(queryDto: AlgoliaQueryDto) {
    return this.algoliaDataService.indexes[queryDto.index].search({
      query: queryDto.query,
      aroundLatLng: queryDto.aroundLatLng,
      aroundRadius: queryDto.aroundRadius,
      pageSize: queryDto.pageSize,
      filterBy: queryDto.filterBy,
      pageNumber: queryDto.pageNumber,
    });
  }
}
