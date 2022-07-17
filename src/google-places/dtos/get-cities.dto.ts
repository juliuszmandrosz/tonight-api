import { IsNotEmpty, IsString } from 'class-validator';

export class GetCitiesDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsString()
  @IsNotEmpty()
  locale: string;
}
