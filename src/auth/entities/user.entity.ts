import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntity } from '@core/base-entity';

export class User implements BaseEntity {
  static collectionName = 'users';

  constructor(params: Partial<User>) {
    Object.assign(this, params);
  }

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsArray()
  @IsNotEmpty()
  favoriteEventIds: string[];

  @IsArray()
  @IsNotEmpty()
  favoriteClubIds: string[];

  @IsNotEmpty()
  /// key - clubId, value - number of entries
  attendance: { [key: string]: number };

  @IsString()
  @IsNotEmpty()
  locale: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsNumber()
  @IsOptional()
  raverCoins: number = 0;
}
