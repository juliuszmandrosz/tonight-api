import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetEventsDto {
  @IsString()
  query: string;

  @IsString()
  filterBy: string;

  @IsNumber()
  @IsNotEmpty()
  pageNumber: number;

  @IsNumber()
  @IsNotEmpty()
  pageSize: number;

  @IsString()
  sortBy: string;
}
