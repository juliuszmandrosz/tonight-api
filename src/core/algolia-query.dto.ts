import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AlgoliaIndex } from '@data-services/algolia/algolia-index';

export class AlgoliaQueryDto {
  @IsEnum(AlgoliaIndex)
  index: AlgoliaIndex;

  @IsString()
  query: string;

  @IsArray()
  filterBy: string[][];

  @IsNumber()
  @IsNotEmpty()
  pageNumber: number;

  @IsNumber()
  @IsNotEmpty()
  pageSize: number;

  @IsString()
  @IsOptional()
  aroundLatLng: string;

  @IsNumber()
  @IsOptional()
  aroundRadius: number;
}
