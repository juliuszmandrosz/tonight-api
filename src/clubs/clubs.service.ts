import { Injectable } from '@nestjs/common';
import { TypesenseDataService } from '@data-services/typesense/typesense-data.service';
import { GetClubsDto } from '@clubs/dtos/get-clubs.dto';

@Injectable()
export class ClubsService {
  constructor(private typesenseDataService: TypesenseDataService) {}

  async getClubs(dto: GetClubsDto) {
    return this.typesenseDataService.clubs.retrieve({
      query: dto.query,
      queryBy: dto.queryBy,
      filterBy: dto.filterBy,
      pageNumber: dto.pageNumber,
      pageSize: dto.pageSize,
      sortBy: dto.sortBy,
    });
  }
}
