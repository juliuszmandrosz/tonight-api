import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TicketPoolsService } from '@event-tickets/services/ticket-pools.service';
import { TicketSalesService } from '@event-tickets/services/ticket-sales.service';
import { Event } from '@events/event.entity';
import { FirestoreDataService } from '@data-services/firestore/firestore-data.service';
import { EventFailure } from '@events/event-failure.type';
import { Transaction } from 'firebase-admin/firestore';

@Injectable()
export class EventTicketsService {
  constructor(
    private firestoreDataService: FirestoreDataService,
    private ticketPoolsService: TicketPoolsService,
    private ticketSalesService: TicketSalesService,
  ) {}

  /// Returns ticket price after update
  async updateEventTicketsOnTicketPayment(
    event: Event,
    isVip: boolean,
  ): Promise<number> {
    return this.firestoreDataService.eventTickets.runTransaction(
      async (transaction) => {
        const eventTicketsRef =
          this.firestoreDataService.eventTickets.findReferenceById(
            event.clubId,
            event.id,
          );

        const eventTickets =
          await this.firestoreDataService.eventTickets.findById(
            event.clubId,
            event.id,
            transaction,
          );

        if (!eventTickets) {
          const response = 'invalid-event-tickets';
          throw new HttpException(response, HttpStatus.NOT_FOUND);
        }

        const vipPrice = isVip
          ? this.ticketPoolsService.getVipPriceFromCurrentPool(
              eventTickets.ticketPools,
            )
          : 0;

        this.ticketSalesService.updateTicketSalesOnTicketPayment({
          ticketSales: eventTickets.ticketSales,
          isVip,
          revenue: event.price + vipPrice,
        });

        this.ticketPoolsService.updateTicketPoolsOnTicketPayment(eventTickets);

        transaction.update(eventTicketsRef, eventTickets);

        return this.ticketPoolsService.getCurrentOrLastPool(
          eventTickets.ticketPools,
        ).ticketPrice;
      },
    );
  }

  /// Returns ticket price after update
  async updateEventTicketsOnCancelReservation({
    event,
    isVip,
    canceledAmount,
  }: UpdateEventTicketsOnCancelReservationParams): Promise<number> {
    return this.firestoreDataService.eventTickets.runTransaction(
      async (transaction) => {
        const eventTicketsRef =
          this.firestoreDataService.eventTickets.findReferenceById(
            event.clubId,
            event.id,
          );

        const eventTickets = await this.tryGetEventTickets({
          eventId: event.id,
          clubId: event.clubId,
          transaction,
        });

        this.ticketSalesService.reduceTicketSalesBySingleTransaction({
          canceledAmount,
          ticketSales: eventTickets.ticketSales,
          isVip,
        });

        this.ticketPoolsService.revertSingleTicketFromPools(eventTickets);

        transaction.update(eventTicketsRef, eventTickets);

        return this.ticketPoolsService.getCurrentOrLastPool(
          eventTickets.ticketPools,
        ).ticketPrice;
      },
    );
  }

  async getVipPrice(clubId: string, eventId: string) {
    const eventTickets = await this.tryGetEventTickets({ eventId, clubId });

    return this.ticketPoolsService.getVipPriceFromCurrentPool(
      eventTickets.ticketPools,
    );
  }

  async checkIfEventIsSoldOut(clubId: string, eventId: string) {
    const eventTickets = await this.tryGetEventTickets({ eventId, clubId });

    if (eventTickets.isSoldOut) {
      const response: EventFailure = 'event-sold-out';
      throw new HttpException(response, HttpStatus.GONE);
    }
  }

  private async tryGetEventTickets({
    clubId,
    eventId,
    transaction,
  }: TryGetEventTicketsParams) {
    const eventTickets = await this.firestoreDataService.eventTickets.findById(
      clubId,
      eventId,
      transaction,
    );

    if (!eventTickets) {
      const response = 'invalid-event-tickets';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }

    return eventTickets;
  }
}

interface TryGetEventTicketsParams {
  clubId: string;
  eventId: string;
  transaction?: Transaction;
}

interface UpdateEventTicketsOnCancelReservationParams {
  event: Event;
  isVip: boolean;
  canceledAmount: number;
}
