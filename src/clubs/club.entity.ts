import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '@core/base-entity';
import { v1 } from 'uuid';

export class Club implements BaseEntity {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string = v1();

  @IsNotEmpty()
  @IsString()
  clubName: string;

  @IsNotEmpty()
  @IsString()
  cityId: string;

  @IsNotEmpty()
  @IsString()
  acceptedCurrency: string;

  @IsNotEmpty()
  @IsString()
  clubImageUrl: string;

  @IsNotEmpty()
  @IsString()
  locationString: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  aboutUs: string;

  @IsNotEmpty()
  location: { [key: string]: number };

  @IsOptional()
  socialMedia: { [key: string]: string };

  @IsNumber()
  @IsOptional()
  reviewCount = 0;

  @IsNumber()
  @IsOptional()
  reviewAvg = 0;
}
