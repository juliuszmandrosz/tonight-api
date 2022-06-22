import { Injectable } from '@nestjs/common';
import { TicketPool } from '@event-tickets/entities/ticket-pool.entity';
import { EventTickets } from '@event-tickets/entities/event-tickets.entity';

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

  revertSingleTicketFromPools(tickets: EventTickets) {
    tickets.isSoldOut = false;

    const ticketPools = tickets.ticketPools;

    const currentPool = this.getCurrentOrLastPool(ticketPools);

    if (currentPool.ticketsSold === 0) {
      TicketPoolsService.resetPool(currentPool);
      this.startPreviousPool(currentPool, ticketPools);
      return;
    }

    TicketPoolsService.restorePool(currentPool);
  }

  getCurrentOrLastPool(ticketPools: TicketPool[]) {
    const lastPool = ticketPools[ticketPools.length - 1];
    return ticketPools.find((pool) => pool.isCurrent) ?? lastPool;
  }

  getVipPriceFromCurrentPool(ticketPools: TicketPool[]) {
    const currentPool = this.getCurrentOrLastPool(ticketPools);
    return currentPool.isVipEnabled ? currentPool.vipPrice : null;
  }

  private startNextPool(currentPool: TicketPool, ticketPools: TicketPool[]) {
    const nextPool = ticketPools.find(
      (pool) => pool.poolNumber === currentPool.poolNumber + 1,
    );

    if (!nextPool) return;

    nextPool.isCurrent = true;

    const index = ticketPools.indexOf(nextPool);
    ticketPools[index] = nextPool;
  }

  private startPreviousPool(
    currentPool: TicketPool,
    ticketPools: TicketPool[],
  ) {
    if (currentPool.poolNumber === 1) return;

    const previousPool = ticketPools.find(
      (pool) => pool.poolNumber == currentPool.poolNumber - 1,
    );

    if (!previousPool) return;

    TicketPoolsService.restorePool(previousPool);

    const index = ticketPools.indexOf(previousPool);
    ticketPools[index] = previousPool;
  }

  private static restorePool(pool: TicketPool) {
    pool.ticketsSold--;
    pool.isSoldOut = false;
    pool.isCurrent = true;
  }

  private static resetPool(pool: TicketPool) {
    pool.ticketsSold = 0;
    pool.isSoldOut = false;
    pool.isCurrent = false;
  }
}
