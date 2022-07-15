import { BaseEntity } from '@core/base-entity';
import { TypesenseRepositoryParams } from '@data-services/typesense/interfaces/typesense-repository-params.interface';
import { RetrieveParams } from '@data-services/typesense/interfaces/retrieve-params.interface';

export class TypesenseRepository<T extends BaseEntity> {
  constructor(private params: TypesenseRepositoryParams) {}

  async retrieve({
    query,
    filterBy,
    pageNumber,
    pageSize,
    sortBy,
  }: RetrieveParams): Promise<T[]> {
    const result = await this.params.typesense
      .collections(this.params.collectionName)
      .documents()
      .search({
        q: query,
        query_by: this.params.queryBy,
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
