import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirestoreDataService } from '@data-services/firestore/firestore-data.service';
import { EventFailure } from '@events/event-failure.type';
import { firestore } from 'firebase-admin';
import Timestamp = firestore.Timestamp;
import { TypesenseDataService } from '@data-services/typesense/typesense-data.service';
import { GetEventsDto } from '@events/dtos/get-events.dto';

@Injectable()
export class EventsService {
  constructor(
    private firestoreDataService: FirestoreDataService,
    private typesenseDataService: TypesenseDataService,
  ) {}

  async getEvents(dto: GetEventsDto) {
    return this.typesenseDataService.events.retrieve({
      query: dto.query,
      queryBy: dto.queryBy,
      filterBy: dto.filterBy,
      pageNumber: dto.pageNumber,
      pageSize: dto.pageSize,
      sortBy: dto.sortBy,
    });
  }

  async checkIfEventIsActive(eventId: string) {
    const event = await this.firestoreDataService.events.findById(eventId);

    if (!event) {
      const response: EventFailure = 'invalid-event';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }

    if (Timestamp.fromMillis(event.eventEndDateTime) < Timestamp.now()) {
      const response: EventFailure = 'event-has-ended';
      throw new HttpException(response, HttpStatus.GONE);
    }

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

  async updateEventOnTicketPayment(
    eventId: string,
    price: number,
  ): Promise<void> {
    await this.firestoreDataService.events.runTransaction(
      async (transaction) => {
        const ref = this.firestoreDataService.events.findReferenceById(eventId);
        const event = await this.firestoreDataService.events.findById(
          eventId,
          transaction,
        );

        if (!event) {
          const response: EventFailure = 'invalid-event';
          throw new HttpException(response, HttpStatus.NOT_FOUND);
        }

        event.attending++;
        event.price = price;

        transaction.update(ref, { ...event });
      },
    );
  }

  async updateEventOnCancelReservation(
    eventId: string,
    price: number,
  ): Promise<void> {
    await this.firestoreDataService.events.runTransaction(
      async (transaction) => {
        const ref = this.firestoreDataService.events.findReferenceById(eventId);
        const event = await this.firestoreDataService.events.findById(
          eventId,
          transaction,
        );

        if (!event) {
          const response: EventFailure = 'invalid-event';
          throw new HttpException(response, HttpStatus.NOT_FOUND);
        }

        event.attending--;
        event.price = price;

        transaction.update(ref, { ...event });
      },
    );
  }
}
