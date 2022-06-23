import { BaseEntity } from '@core/base-entity';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClubSelector implements BaseEntity {
  static parentCollectionName = 'clubs';
  static subCollectionName = 'selectors';

  constructor(params: Partial<ClubSelector>) {
    Object.assign(this, params);
  }

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
