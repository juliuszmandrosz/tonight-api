import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AlgoliaSearchService } from '@data-services/algolia/algolia-search.service';
import { AlgoliaQueryDto } from '@core/algolia-query.dto';
import { FirebaseAuthGuard } from '@core/firebase-auth.guard';

@UseGuards(FirebaseAuthGuard)
@Controller('algolia')
export class AlgoliaController {
  constructor(private searchService: AlgoliaSearchService) {}

  @Post('search') getEvents(@Body() dto: AlgoliaQueryDto) {
    return this.searchService.search(dto);
  }
}
