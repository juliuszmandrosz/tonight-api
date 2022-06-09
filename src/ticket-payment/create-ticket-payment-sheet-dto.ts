export class CreateTicketPaymentSheetDto {
  eventId: string;
  isVip: boolean;
  sendInvoice: boolean;
  promotionCode?: string;
}
