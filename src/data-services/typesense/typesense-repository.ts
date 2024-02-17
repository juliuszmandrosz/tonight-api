import { BaseEntity } from '@core/base-entity';
import { TypesenseRepositoryParams } from '@data-services/typesense/interfaces/typesense-repository-params.interface';
import { TypesenseRetrieveParams } from '@data-services/typesense/interfaces/typesense-retrieve-params.interface';

export class TypesenseRepository<T extends BaseEntity> {
  constructor(private params: TypesenseRepositoryParams) {}

  async retrieve({
    query,
    queryBy,
    filterBy,
    pageNumber,
    pageSize,
    sortBy,
  }: TypesenseRetrieveParams): Promise<T[]> {
    const result = await this.params.typesense
      .collections(this.params.collectionName)
      .documents()
      .search({
        q: query,
        query_by: queryBy ? queryBy : this.params.defaultQueryBy,
        filter_by: filterBy,
        page: pageNumber,
        per_page: pageSize,
        sort_by: sortBy,
      });

    if (result.found === 0) {
      return [];
    }

    return result.hits.map((hit) => hit.document as T);
  }
}
