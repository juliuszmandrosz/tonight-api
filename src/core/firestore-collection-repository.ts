import {
  DocumentReference,
  DocumentSnapshot,
  Transaction,
} from '@google-cloud/firestore';

export abstract class FirestoreCollectionRepository<T> {
  abstract findReferenceById(id: string): DocumentReference;

  abstract findDocumentById(
    id: string,
    transaction?: Transaction,
  ): Promise<DocumentSnapshot>;

  abstract findById(id: string, transaction?: Transaction): Promise<T | null>;

  abstract create(id: string, item: T): Promise<void>;

  abstract update(id: string, item: T): Promise<void>;

  abstract delete(id: string): Promise<void>;

  abstract runTransaction(
    updateFunction: (transaction: Transaction) => Promise<T>,
  ): Promise<any>;
}
