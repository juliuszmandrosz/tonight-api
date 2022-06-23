import { BaseEntity } from '@core/base-entity';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Selector implements BaseEntity {
  static collectionName = 'selectors';

  constructor(params: Partial<Selector>) {
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
  clubId: string;
}
