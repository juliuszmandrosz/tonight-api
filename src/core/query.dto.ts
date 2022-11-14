import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @IsString()
  query: string;

  @IsString()
  @IsOptional()
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
