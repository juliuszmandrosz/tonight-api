import { BaseEntity } from '@core/base-entity';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { firestore } from 'firebase-admin';
import Timestamp = firestore.Timestamp;

export class SelectorAccessCode implements BaseEntity {
  static collectionName = 'selectorsAccessCodes';

  constructor(params: Partial<SelectorAccessCode>) {
    Object.assign(this, params);
  }

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  clubId: string;

  @IsNotEmpty()
  expirationDateTime: Timestamp;
}
