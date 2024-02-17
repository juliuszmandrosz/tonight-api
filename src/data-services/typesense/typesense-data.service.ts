import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Event } from '@events/event.entity';

import { TypesenseRepository } from '@data-services/typesense/typesense-repository';
import { Club } from '@clubs/club.entity';
import { TypesenseClientProvider } from '@typesense/typesense-providers';
import { Client } from 'typesense';

@Injectable()
export class TypesenseDataService implements OnApplicationBootstrap {
  events: TypesenseRepository<Event>;
  clubs: TypesenseRepository<Club>;

  constructor(@Inject(TypesenseClientProvider) private typesense: Client) {}

  onApplicationBootstrap() {
    this.events = new TypesenseRepository<Event>({
      typesense: this.typesense,
      collectionName: Event.collectionName,
      defaultQueryBy: 'eventName, artistName, clubName',
    });

    this.clubs = new TypesenseRepository<Club>({
      typesense: this.typesense,
      collectionName: Club.collectionName,
      defaultQueryBy: 'clubName, locationString',
    });
  }
}
