import { BaseEntity } from '@core/base-entity';

export function mapAlgoliaResults<T extends BaseEntity>(hits: any[]): T[] {
  return hits.map((hit) => {
    const mapped: Partial<T> = {};

    for (const key in hit) {
      if (key === '_geoloc') {
        mapped['location'] = [hit._geoloc.lat, hit._geoloc.lng];
        continue;
      }

      if (key === 'objectID') {
        mapped['id'] = hit.objectID;
        continue;
      }

      if (key === '_highlightResult') {
        continue;
      }

      mapped[key] = hit[key];
    }

    return mapped as T;
  });
}
