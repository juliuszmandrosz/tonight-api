import { Injectable } from '@nestjs/common';
import { TicketSales } from '@event-tickets/entities/ticket-sales.entity';

@Injectable()
export class TicketSalesService {
  updateTicketSalesOnTicketPayment({
    revenue,
    ticketSales,
  }: UpdateEventTicketsOnTicketPaymentParams) {
    ticketSales.ticketsSold++;
    ticketSales.totalRevenue += revenue;
    ticketSales.clubIncome += TicketSalesService.getClubIncome(
      revenue,
      ticketSales.eventFee,
    );
  }

  reduceTicketSalesBySingleTransaction({
    ticketSales,
    canceledAmount,
    isVip,
  }: ReduceTicketSalesBySingleTransactionParams) {
    const canceledClubIncome = TicketSalesService.getClubIncome(
      canceledAmount,
      ticketSales.eventFee,
    );

    ticketSales.ticketsSold--;

    if (isVip) {
      ticketSales.vipsSold--;
    }

    ticketSales.totalRevenue -= canceledAmount;
    ticketSales.clubIncome -= canceledClubIncome;
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
  ticketSales: TicketSales;
}

interface ReduceTicketSalesBySingleTransactionParams {
  ticketSales: TicketSales;
  canceledAmount: number;
  isVip: boolean;
}
