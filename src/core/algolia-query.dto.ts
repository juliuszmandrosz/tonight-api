import {
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

  @IsString()
  filters: string;

  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  hitsPerPage: number;

  @IsString()
  @IsOptional()
  aroundLatLng: string;

  @IsNumber()
  @IsOptional()
  aroundRadius: number;
}
