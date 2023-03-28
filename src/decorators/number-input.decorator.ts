import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Field } from '@nestjs/graphql';

export function NumberInput() {
  return applyDecorators(
    Field(() => Number),
    IsNumber(),
    IsNotEmpty(),
  );
}
