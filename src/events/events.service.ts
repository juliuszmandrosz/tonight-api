import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirestoreRepositories } from '@firestore-repositories/firestore-repositories';

@Injectable()
export class EventsService {
  constructor(private repositories: FirestoreRepositories) {}

  async checkIfEventIsActive(eventId: string) {
    const event = await this.repositories.events.findById(eventId);

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
    await this.repositories.events.runTransaction(async (transaction) => {
      const ref = this.repositories.events.findReferenceById(eventId);
      const event = await this.repositories.events.findById(
        eventId,
        transaction,
      );

      event.attending++;
      event.price = price;

      transaction.update(ref, {
        attending: event.attending,
        price: event.price,
      });
    });
  }
}
