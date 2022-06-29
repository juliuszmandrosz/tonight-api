import { BaseEntity } from '@core/base-entity';
import { toJson } from '@core/json-utils';
import {
  Firestore,
  Transaction,
  DocumentSnapshot,
  DocumentReference,
} from 'firebase-admin/firestore';

export class FirestoreSubcollectionRepository<T extends BaseEntity> {
  constructor(
    private firestore: Firestore,
    private parentCollection: string,
    private subCollection: string,
  ) {}

  async create(parentId: string, id: string, item: T): Promise<void> {
    await this.findReferenceById(parentId, id).set(toJson<T>(item));
  }

  async delete(parentId: string, id: string): Promise<void> {
    await this.findReferenceById(parentId, id).delete();
  }

  async findById(
    parentId: string,
    id: string,
    transaction?: Transaction,
  ): Promise<T | null> {
    const document = await this.findDocumentById(parentId, id, transaction);
    if (!document.exists) return null;
    const data = document.data() as T;
    data.id = id;
    return data;
  }

  findDocumentById(
    parentId: string,
    id: string,
    transaction?: Transaction,
  ): Promise<DocumentSnapshot> {
    const ref = this.findReferenceById(parentId, id);
    return transaction ? transaction.get(ref) : ref.get();
  }

  findReferenceById(parentId: string, id: string): DocumentReference {
    return this.firestore
      .collection(this.parentCollection)
      .doc(parentId)
      .collection(this.subCollection)
      .doc(id);
  }

  runTransaction(
    updateFunction: (transaction: Transaction) => Promise<any>,
  ): Promise<any> {
    return this.firestore.runTransaction(updateFunction);
  }
}
