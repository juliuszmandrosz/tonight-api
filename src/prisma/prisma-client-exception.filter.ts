import {
  BadRequestException,
  Catch,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { AuthFailure } from '@auth/types/auth.failure.type';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError) {
    const message = exception.message;

    switch (exception.code) {
      case 'P2025': {
        throw new NotFoundException(message);
      }

      case 'P2003': {
        throw new BadRequestException(message);
      }

      case 'P2002': {
        const response: AuthFailure = 'already-exists';
        throw new ConflictException(response, message);
      }
    }
  }
}
