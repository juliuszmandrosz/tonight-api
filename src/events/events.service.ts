import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirestoreDataService } from '@data-services/firestore/firestore-data.service';

@Injectable()
export class EventsService {
  constructor(private firestoreDataService: FirestoreDataService) {}

  async checkIfEventIsActive(eventId: string) {
    const event = await this.firestoreDataService.events.findById(eventId);

    if (event.isCanceled) {
      // TODO - change
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    if (event.isBeingPostponed) {
      // TODO - change
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return event;
  }

  async updateEventOnTicketPayment(eventId, price): Promise<void> {
    await this.firestoreDataService.events.runTransaction(
      async (transaction) => {
        const ref = this.firestoreDataService.events.findReferenceById(eventId);
        const event = await this.firestoreDataService.events.findById(
          eventId,
          transaction,
        );

        event.attending++;
        event.price = price;

        transaction.update(ref, {
          attending: event.attending,
          price: event.price,
        });
      },
    );
  }
}
