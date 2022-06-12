import { Injectable } from '@nestjs/common';
import { TicketPoolsService } from '@event-tickets/services/ticket-pools.service';
import { TicketSalesService } from '@event-tickets/services/ticket-sales.service';
import { Event } from '@events/event.entity';
import { EventTickets } from '@event-tickets/entities/event-tickets.entity';
import { FirestoreDataService } from '@data-services/firestore/firestore-data.service';
import { toJson } from '@core/json-utils';

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
  ): Promise<EventTickets> {
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

        transaction.update(eventTicketsRef, toJson<EventTickets>(eventTickets));

        return this.ticketPoolsService.getCurrentOrLastPool(
          eventTickets.ticketPools,
        ).ticketPrice;
      },
    );
  }

  async getVipPrice(clubId: string, eventId: string) {
    const eventTickets = await this.firestoreDataService.eventTickets.findById(
      clubId,
      eventId,
    );
    return this.ticketPoolsService.getVipPriceFromCurrentPool(
      eventTickets.ticketPools,
    );
  }
}
