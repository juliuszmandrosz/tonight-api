import { firestore } from 'firebase-admin';
import Timestamp = firestore.Timestamp;
import { BaseEntity } from '@core/base-entity';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PartnerAccessCode implements BaseEntity {
  static collectionName = 'partnersAccessCodes';

  constructor(params: Partial<PartnerAccessCode>) {
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
