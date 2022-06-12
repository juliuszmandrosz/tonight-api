import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirestoreDataService } from '@data-services/firestore/firestore-data.service';
import { toJson } from '@core/json-utils';
import { Event } from '@events/event.entity';
import { EventFailure } from '@events/event-failure.type';

@Injectable()
export class EventsService {
  constructor(private firestoreDataService: FirestoreDataService) {}

  async checkIfEventIsActive(eventId: string) {
    const event = await this.firestoreDataService.events.findById(eventId);

    if (event.isCanceled) {
      const response: EventFailure = 'event-canceled';
      throw new HttpException(response, HttpStatus.GONE);
    }

    if (event.isBeingPostponed) {
      const response: EventFailure = 'event-being-postponed';
      throw new HttpException(response, HttpStatus.GONE);
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

        transaction.update(ref, toJson<Event>(event));
      },
    );
  }
}
