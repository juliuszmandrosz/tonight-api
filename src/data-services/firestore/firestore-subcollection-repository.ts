import {
  Firestore,
  DocumentReference,
  DocumentSnapshot,
  Transaction,
  runTransaction,
  deleteDoc,
  setDoc,
  doc,
  getDoc,
  collection,
} from 'firebase/firestore/lite';
import { BaseEntity } from '@core/base-entity';
import { toJson } from '@core/json-utils';

export class FirestoreSubcollectionRepository<T extends BaseEntity> {
  constructor(
    private firestore: Firestore,
    private parentCollection: string,
    private subCollection: string,
  ) {}

  async create(parentId: string, id: string, item: T): Promise<void> {
    await setDoc(this.findReferenceById(parentId, id), toJson<T>(item));
  }

  async delete(parentId: string, id: string): Promise<void> {
    await deleteDoc(this.findReferenceById(parentId, id));
  }

  async findById(
    parentId: string,
    id: string,
    transaction?: Transaction,
  ): Promise<T | null> {
    const document = await this.findDocumentById(parentId, id, transaction);
    if (!document.exists()) return null;
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
    return transaction ? transaction.get(ref) : getDoc(ref);
  }

  findReferenceById(parentId: string, id: string): DocumentReference {
    const parentCol = doc(this.firestore, this.parentCollection, parentId);
    const col = collection(parentCol, this.subCollection);
    return doc(col, id);
  }

  runTransaction(
    updateFunction: (transaction: Transaction) => Promise<any>,
  ): Promise<any> {
    return runTransaction(this.firestore, updateFunction);
  }
}
