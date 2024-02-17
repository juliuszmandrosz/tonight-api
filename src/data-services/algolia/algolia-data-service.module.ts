import { Module } from '@nestjs/common';
import { AlgoliaDataService } from '@data-services/algolia/algolia-data.service';
import { AlgoliaController } from '@data-services/algolia/algolia.controller';
import { AlgoliaSearchService } from '@data-services/algolia/algolia-search.service';

@Module({
  controllers: [AlgoliaController],
  providers: [AlgoliaDataService, AlgoliaSearchService],
})
export class AlgoliaDataServiceModule {}
