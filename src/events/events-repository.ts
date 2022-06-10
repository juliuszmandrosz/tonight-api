import { Inject, Injectable } from '@nestjs/common';
import { FirestoreCollectionRepository } from '../core/firestore-collection-repository';
import { FirestoreDatabaseProvider } from '../infrastructure/firestore/firestore-providers';
import { Firestore } from '@google-cloud/firestore';
import { Event } from '@events/event-entity';

@Injectable()
export class EventsRepository implements FirestoreCollectionRepository<Event> {
  collectionName = 'events';

  constructor(
    @Inject(FirestoreDatabaseProvider)
    private firestore: Firestore,
  ) {}

  async findDocumentById(
    id: string,
    transaction?: FirebaseFirestore.Transaction,
  ): Promise<FirebaseFirestore.DocumentSnapshot> {
    const ref = this.findReferenceById(id);

    return transaction ? transaction.get(ref) : ref.get();
  }

  async create(id: string, item: Event): Promise<void> {
    await this.findReferenceById(id).set(item);
  }

  async update(id: string, item: Event): Promise<void> {
    await this.findReferenceById(id).set(item);
  }

  async delete(id: string): Promise<void> {
    await this.findReferenceById(id).delete();
  }

  async findById(
    id: string,
    transaction: FirebaseFirestore.Transaction | undefined,
  ): Promise<Event | null> {
    const doc = await this.findDocumentById(id, transaction);

    const result = doc.data() as Event;
    result.id = id;

    return result;
  }

  findReferenceById(id: string): FirebaseFirestore.DocumentReference {
    return this.firestore.collection(this.collectionName).doc(id);
  }

  async runTransaction(
    updateFunction: (
      transaction: FirebaseFirestore.Transaction,
    ) => Promise<Event>,
  ): Promise<any> {
    return this.firestore.runTransaction(updateFunction);
  }
}
