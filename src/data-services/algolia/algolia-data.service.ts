import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Event } from '@events/event.entity';
import { Club } from '@clubs/club.entity';
import { AlgoliaRepository } from '@data-services/algolia/algolia-repository';
import { AlgoliaClientProvider } from '@algolia/algolia-providers';
import { SearchClient } from 'algoliasearch';
import { AlgoliaIndex } from '@data-services/algolia/algolia-index';
import { BaseEntity } from '@core/base-entity';

@Injectable()
export class AlgoliaDataService implements OnApplicationBootstrap {
  private events: AlgoliaRepository<Event>;
  private clubs: AlgoliaRepository<Club>;
  private collectives: AlgoliaRepository<BaseEntity>;
  private artists: AlgoliaRepository<BaseEntity>;
  indexes: Record<AlgoliaIndex, AlgoliaRepository<any>>;

  constructor(@Inject(AlgoliaClientProvider) private algolia: SearchClient) {}

  onApplicationBootstrap() {
    this.events = new AlgoliaRepository<Event>({
      index: this.algolia.initIndex(Event.collectionName),
    });

    this.clubs = new AlgoliaRepository<Club>({
      index: this.algolia.initIndex(Club.collectionName),
    });

    // TODO - add collectives and artists
    this.collectives = new AlgoliaRepository<BaseEntity>({
      index: this.algolia.initIndex('collectives'),
    });

    this.artists = new AlgoliaRepository<BaseEntity>({
      index: this.algolia.initIndex('artists'),
    });

    this.indexes = {
      [AlgoliaIndex.events]: this.events,
      [AlgoliaIndex.clubs]: this.clubs,
      [AlgoliaIndex.collectives]: this.collectives,
      [AlgoliaIndex.artists]: this.artists,
    };
  }
}
