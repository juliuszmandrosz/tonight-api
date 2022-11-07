import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class QueryDto {
  @IsString()
  query: string;

  @IsString()
  queryBy: string;

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
