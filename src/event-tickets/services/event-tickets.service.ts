import { Injectable } from '@nestjs/common';
import { TicketPoolsService } from '@event-tickets/services/ticket-pools.service';
import { TicketSalesService } from '@event-tickets/services/ticket-sales.service';
import { Event } from '@events/event-entity';
import { EventTickets } from '@event-tickets/entities/event-tickets-entity';
import { FirestoreRepositories } from '@firestore-repositories/firestore-repositories';

@Injectable()
export class EventTicketsService {
  constructor(
    private repositories: FirestoreRepositories,
    private ticketPoolsService: TicketPoolsService,
    private ticketSalesService: TicketSalesService,
  ) {}

  /// Returns ticket price after update
  async updateEventTicketsOnTicketPayment(
    event: Event,
    isVip: boolean,
  ): Promise<EventTickets> {
    return this.repositories.eventTickets.runTransaction(
      async (transaction) => {
        const eventTicketsRef =
          this.repositories.eventTickets.findReferenceById(
            event.clubId,
            event.id,
          );

        const eventTickets = await this.repositories.eventTickets.findById(
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

        transaction.update(
          eventTicketsRef,
          JSON.parse(JSON.stringify(eventTickets)),
        );

        return this.ticketPoolsService.getCurrentOrLastPool(
          eventTickets.ticketPools,
        ).ticketPrice;
      },
    );
  }

  async getVipPrice(clubId: string, eventId: string) {
    const eventTickets = await this.repositories.eventTickets.findById(
      clubId,
      eventId,
    );
    return this.ticketPoolsService.getVipPriceFromCurrentPool(
      eventTickets.ticketPools,
    );
  }
}
