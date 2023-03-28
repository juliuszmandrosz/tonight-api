import { applyDecorators } from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Field } from '@nestjs/graphql';

export function EmailInput() {
  return applyDecorators(
    Field(() => String),
    IsEmail(),
    IsNotEmpty(),
  );
}
