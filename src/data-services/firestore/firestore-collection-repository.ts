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

export class FirestoreCollectionRepository<T extends BaseEntity> {
  constructor(private firestore: Firestore, private collectionName: string) {}

  async create(id: string, item: T): Promise<void> {
    await setDoc(this.findReferenceById(id), JSON.parse(JSON.stringify(item)));
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

  findDocumentById(
    id: string,
    transaction?: Transaction,
  ): Promise<DocumentSnapshot> {
    const ref = this.findReferenceById(id);
    return transaction ? transaction.get(ref) : getDoc(ref);
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
}
