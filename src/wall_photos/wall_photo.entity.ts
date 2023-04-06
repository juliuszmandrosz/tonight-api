import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '@core/base-entity';
import { v1 } from 'uuid';

export class WallPhoto implements BaseEntity {
  static collectionName = 'wallPhotos';

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string = v1();

  @IsString()
  @IsNotEmpty()
  photoUrl: string;

  @IsString()
  @IsNotEmpty()
  clubId: string;

  @IsString()
  @IsNotEmpty()
  clubName: string;

  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  eventName: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNumber()
  @IsNotEmpty()
  eventEndDateTime: number;

  @IsNumber()
  @IsNotEmpty()
  createdAt: number;

  @IsString()
  @IsOptional()
  userProfilePhotoUrl: string;
}
