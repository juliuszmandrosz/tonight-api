import { Injectable } from '@nestjs/common';
import { TicketSales } from '@event-tickets/entities/ticket-sales-entity';

@Injectable()
export class TicketSalesService {
  updateTicketSalesOnTicketPayment({
    revenue,
    isVip,
    ticketSales,
  }: UpdateEventTicketsOnTicketPaymentParams) {
    ticketSales.ticketsSold++;

    if (isVip) {
      ticketSales.vipsSold++;
    }

    ticketSales.totalRevenue += revenue;
    ticketSales.clubIncome += TicketSalesService.getClubIncome(
      revenue,
      ticketSales.eventFee,
    );
  }

  private static getClubIncome(amount: number, eventFee: number) {
    const fee = TicketSalesService.getEventFeeAmount(amount, eventFee);
    return amount - fee;
  }

  private static getEventFeeAmount(amount: number, eventFee: number) {
    return amount * eventFee;
  }
}

interface UpdateEventTicketsOnTicketPaymentParams {
  revenue: number;
  isVip: boolean;
  ticketSales: TicketSales;
}
