import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

export function StringInput() {
  return applyDecorators(IsString(), IsNotEmpty());
}
