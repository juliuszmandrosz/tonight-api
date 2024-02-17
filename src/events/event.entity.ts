import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntity } from '@core/base-entity';
import { v1 } from 'uuid';

export class Event implements BaseEntity {
  static collectionName = 'events';

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string = v1();

  @IsString()
  @IsNotEmpty()
  eventName: string;

  @IsString()
  @IsNotEmpty()
  clubId: string;

  @IsString()
  @IsNotEmpty()
  clubName: string;

  @IsNumber()
  @IsNotEmpty()
  eventStartDateTime: number;

  @IsNumber()
  @IsNotEmpty()
  eventEndDateTime: number;

  @IsNumber()
  @IsNotEmpty()
  originalStartDateTime: number;

  @IsNumber()
  @IsNotEmpty()
  minAge: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  allowedOutfit: string;

  @IsArray()
  @IsNotEmpty()
  musicalGenres: string[];

  @IsNotEmpty()
  location: number[];

  @IsString()
  @IsNotEmpty()
  cityId: string;

  @IsBoolean()
  isConcert: boolean;

  @IsString()
  @IsNotEmpty()
  eventPhotoUrl: string;

  @IsOptional()
  urlLinks: { [key: string]: string };

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  artistName: string;

  @IsNumber()
  @IsOptional()
  attending = 0;

  @IsBoolean()
  @IsOptional()
  isBeingPostponed = false;

  @IsBoolean()
  @IsOptional()
  isCanceled = false;

  @IsString()
  @IsOptional()
  connectedStripeAccountId?: string;
}
