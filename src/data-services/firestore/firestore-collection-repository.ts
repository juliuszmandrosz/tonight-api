import { BaseEntity } from '@core/base-entity';
import { getResultFromQuery } from '@data-services/firestore/firestore-utils';
import {
  Firestore,
  WhereFilterOp,
  Transaction,
  DocumentReference,
  QuerySnapshot,
  DocumentSnapshot,
  Query,
} from 'firebase-admin/firestore';

export class FirestoreCollectionRepository<T extends BaseEntity> {
  constructor(private firestore: Firestore, private collectionName: string) {}

  async create(id: string, item: T): Promise<void> {
    await this.findReferenceById(id).set({ ...item });
  }

  async update(id: string, item: T): Promise<void> {
    await this.findReferenceById(id).update({ ...item });
  }

  async delete(id: string): Promise<void> {
    await this.findReferenceById(id).delete();
  }

  async findById(id: string, transaction?: Transaction): Promise<T | null> {
    const document = await this.findDocumentById(id, transaction);
    if (!document.exists) return null;
    const data = document.data() as T;
    data.id = id;
    return data;
  }

  async findOneByField(fieldName: string, value: string): Promise<T | null> {
    const q = await this.findDocumentsByField(fieldName, value);
    return getResultFromQuery<T>(q);
  }

  async findOneByParams(params: QueryParam[]): Promise<T | null> {
    const q = await this.findDocumentsByParams(params);
    return getResultFromQuery<T>(q);
  }

  runTransaction(
    updateFunction: (transaction: Transaction) => Promise<any>,
  ): Promise<any> {
    return this.firestore.runTransaction(updateFunction);
  }

  findReferenceById(id: string): DocumentReference {
    return this.firestore.collection(this.collectionName).doc(id);
  }

  private findDocumentById(
    id: string,
    transaction?: Transaction,
  ): Promise<DocumentSnapshot> {
    const ref = this.findReferenceById(id);
    return transaction ? transaction.get(ref) : ref.get();
  }

  private findDocumentsByField(
    fieldName: string,
    value: string,
  ): Promise<QuerySnapshot> {
    const q = this.firestore
      .collection(this.collectionName)
      .where(fieldName, '==', value);
    return q.get();
  }

  private findDocumentsByParams(params: QueryParam[]): Promise<QuerySnapshot> {
    let query: Query;
    for (const param of params) {
      query = this.firestore
        .collection(this.collectionName)
        .where(param.fieldName, param.operator, param.fieldValue);
    }

    return query.get();
  }
}

interface QueryParam {
  fieldName: string;
  fieldValue: any;
  operator: WhereFilterOp;
}
