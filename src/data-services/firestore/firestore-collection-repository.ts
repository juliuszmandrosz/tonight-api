import {
  Firestore,
  DocumentReference,
  DocumentSnapshot,
  Transaction,
  QuerySnapshot,
  WhereFilterOp,
  QueryConstraint,
  runTransaction,
  deleteDoc,
  setDoc,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore/lite';
import { BaseEntity } from '@core/base-entity';
import { getResultFromQuery } from '@data-services/firestore/firestore-utils';

export class FirestoreCollectionRepository<T extends BaseEntity> {
  constructor(private firestore: Firestore, private collectionName: string) {}

  async create(id: string, item: T): Promise<void> {
    await setDoc(this.findReferenceById(id), JSON.parse(JSON.stringify(item)));
  }

  async update(id: string, item: T): Promise<void> {
    await updateDoc(
      this.findReferenceById(id),
      JSON.parse(JSON.stringify(item)),
    );
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(this.findReferenceById(id));
  }

  async findById(id: string, transaction?: Transaction): Promise<T | null> {
    const document = await this.findDocumentById(id, transaction);
    if (!document.exists()) return null;
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
    return runTransaction(this.firestore, updateFunction);
  }

  findReferenceById(id: string): DocumentReference {
    const col = collection(this.firestore, this.collectionName);
    return doc(col, id);
  }

  private findDocumentById(
    id: string,
    transaction?: Transaction,
  ): Promise<DocumentSnapshot> {
    const ref = this.findReferenceById(id);
    return transaction ? transaction.get(ref) : getDoc(ref);
  }

  private findDocumentsByField(
    fieldName: string,
    value: string,
  ): Promise<QuerySnapshot> {
    const col = collection(this.firestore, this.collectionName);
    const q = query(col, where(fieldName, '==', value));

    return getDocs(q);
  }

  private findDocumentsByParams(params: QueryParam[]): Promise<QuerySnapshot> {
    const col = collection(this.firestore, this.collectionName);
    const constraints: QueryConstraint[] = [];
    for (const param of params) {
      constraints.push(
        where(param.fieldName, param.operator, param.fieldValue),
      );
    }
    const q = query(col, ...constraints);
    return getDocs(q);
  }
}

interface QueryParam {
  fieldName: string;
  fieldValue: any;
  operator: WhereFilterOp;
}
