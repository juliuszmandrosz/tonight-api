import { BaseEntity } from '@core/base-entity';
import {
  Firestore,
  Transaction,
  DocumentSnapshot,
  DocumentReference,
} from 'firebase-admin/firestore';
import { Query, QuerySnapshot } from 'firebase-admin/lib/firestore';
import { getResultFromQuery } from '@data-services/firestore/firestore-utils';
import { QueryParam } from '@data-services/firestore/query-param.interface';

export class FirestoreSubcollectionRepository<T extends BaseEntity> {
  constructor(
    private firestore: Firestore,
    private parentCollection: string,
    private subCollection: string,
  ) {}

  async create(parentId: string, id: string, item: T): Promise<void> {
    await this.findReferenceById(parentId, id).set({ ...item });
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

  async findOneByField(
    parentId: string,
    fieldName: string,
    value: string,
  ): Promise<T | null> {
    const q = await this.findDocumentsByField(parentId, fieldName, value);
    return getResultFromQuery<T>(q);
  }

  async findOneByParams(
    parentId: string,
    params: QueryParam[],
  ): Promise<T | null> {
    const q = await this.findDocumentsByParams(parentId, params);
    return getResultFromQuery<T>(q);
  }

  findDocumentById(
    parentId: string,
    id: string,
    transaction?: Transaction,
  ): Promise<DocumentSnapshot> {
    const ref = this.findReferenceById(parentId, id);
    return transaction ? transaction.get(ref) : ref.get();
  }

  private findDocumentsByField(
    parentId: string,
    fieldName: string,
    value: string,
  ): Promise<QuerySnapshot> {
    const q = this.firestore
      .collection(this.parentCollection)
      .doc(parentId)
      .collection(this.subCollection)
      .where(fieldName, '==', value);
    return q.get();
  }

  private findDocumentsByParams(
    parentId: string,
    params: QueryParam[],
  ): Promise<QuerySnapshot> {
    let query: Query;
    for (const param of params) {
      query = this.firestore
        .collection(this.parentCollection)
        .doc(parentId)
        .collection(this.subCollection)
        .where(param.fieldName, param.operator, param.fieldValue);
    }

    return query.get();
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
