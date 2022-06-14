import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
  email: string;

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
}
