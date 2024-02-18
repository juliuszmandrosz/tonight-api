import { BaseEntity } from '@core/base-entity';
import { AlgoliaRepositoryParams } from '@data-services/algolia/interfaces/algolia-repository-params.interface';
import { AlgoliaRetrieveParams } from '@data-services/algolia/interfaces/algolia-retrieve-params.interface';
import { mapAlgoliaResults } from '@data-services/algolia/utils/map-algolia-results';

export class AlgoliaRepository<T extends BaseEntity> {
  constructor(private params: AlgoliaRepositoryParams) {}

  async search({
    query,
    filters,
    page,
    aroundLatLng,
    aroundRadius,
    hitsPerPage,
  }: AlgoliaRetrieveParams): Promise<T[]> {
    const response = await this.params.index.search(query, {
      filters,
      page,
      hitsPerPage,
      aroundLatLng,
      aroundRadius,
    });

    return mapAlgoliaResults<T>(response.hits);
  }
}
