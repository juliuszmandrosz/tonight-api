import { QuerySnapshot } from 'firebase/firestore/lite';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseEntity } from '@core/base-entity';

export function getResultFromQuery<T extends BaseEntity>(q: QuerySnapshot) {
  if (q.docs.length === 0) return null;
  if (q.docs.length > 1) {
    throw new HttpException('too-many-items', HttpStatus.FORBIDDEN);
  }
  const result = q.docs[0].data() as T;
  result.id = q.docs[0].id;
  return result;
}
