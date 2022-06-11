import { Injectable } from '@nestjs/common';
import { TicketPool } from '@event-tickets/entities/ticket-pool-entity';
import { EventTickets } from '@event-tickets/entities/event-tickets-entity';

@Injectable()
export class TicketPoolsService {
  updateTicketPoolsOnTicketPayment(eventTickets: EventTickets) {
    const ticketPools = eventTickets.ticketPools;

    const currentPool = this.getCurrentOrLastPool(ticketPools);
    currentPool.ticketsSold++;

    const isCurrentPoolSoldOut =
      currentPool.ticketsSold === currentPool.ticketQuantity;

    if (isCurrentPoolSoldOut) {
      currentPool.isSoldOut = true;
      currentPool.isCurrent = false;

      const lastPoolNumber = ticketPools[ticketPools.length - 1].poolNumber;
      const isLastPool = currentPool.poolNumber === lastPoolNumber;

      eventTickets.isSoldOut = isLastPool;

      if (!isLastPool) {
        this.startNextPool(currentPool, ticketPools);
      }
    }
  }

  getCurrentOrLastPool(ticketPools: TicketPool[]) {
    const lastPool = ticketPools[ticketPools.length - 1];
    return ticketPools.find((pool) => pool.isCurrent) ?? lastPool;
  }

  getVipPriceFromCurrentPool(ticketPools: TicketPool[]) {
    const currentPool = this.getCurrentOrLastPool(ticketPools);
    return currentPool.isVipEnabled ? currentPool.vipPrice : 0;
  }

  private startNextPool(currentPool: TicketPool, ticketPools: TicketPool[]) {
    const nextPool = ticketPools.find(
      (pool) => pool.poolNumber == currentPool.poolNumber + 1,
    );

    if (!nextPool) return;

    nextPool.isCurrent = true;

    const index = ticketPools.indexOf(nextPool);
    ticketPools[index] = nextPool;
  }
}
