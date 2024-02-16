import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EventsService } from '@events/events.service';
import { PaymentSheet } from '@payments/interfaces/payment.sheet.interface';
import { EventTicketsService } from '@event-tickets/services/event-tickets.service';
import { PromotionCode } from '@payments/entities/promotion-code.entity';
import { Stripe } from 'stripe';
import { apiVersion } from '@constants/stripe-constants';
import { TicketPaymentSession } from '@payments/entities/ticket-payment-session.entity';
import { FirestoreDataService } from '@data-services/firestore/firestore-data.service';
import { AppConfigService } from '@config/app-config.service';
import { PaymentFailure } from '@payments/types/payment-failure.type';
import { CloudTasksService } from '@cloud-tasks/cloud-tasks.service';
import { CancelTicketReservationDto } from '@payments/dtos/cancel-ticket-reservation.dto';
import { EventFees } from '@payments/interfaces/event-fees.interface';
import { StripeProvider } from '@stripe/stripe-providers';
import { CreateTicketPaymentSheetDto } from '@payments/dtos/create-ticket-payment-sheet.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private eventService: EventsService,
    private eventTicketsService: EventTicketsService,
    private firestoreDataService: FirestoreDataService,
    private appConfigService: AppConfigService,
    private cloudTasksService: CloudTasksService,
    @Inject(StripeProvider) private stripe: Stripe,
  ) {}

  async createTicketPaymentSheet(
    dto: CreateTicketPaymentSheetDto,
  ): Promise<PaymentSheet> {
    const event = await this.eventService.checkIfEventIsActive(dto.eventId);
    await this.eventTicketsService.checkIfTicketsAreAvailable(
      event.clubId,
      event.id,
    );
    const serviceFeeAmount = this.getServiceFeeAmount(
      event.price,
      event.currency,
    );
    const promotionCodeAmountOff = dto.promotionCode
      ? await this.getPromotionCode(dto.userId, dto.promotionCode).then(
          (code) => code.amountOff,
        )
      : 0;
    const revenue = event.price * dto.quantity;
    const paymentSheetAmount = PaymentsService.getPaymentSheetAmount({
      revenue,
      serviceFeeAmount: serviceFeeAmount,
      promotionCodeAmountOff: promotionCodeAmountOff,
    });
    const paymentSheet = await this.createPaymentSheetForUser({
      amount: paymentSheetAmount,
      description: event.eventName,
      currency: event.currency,
      userId: dto.userId,
      connectedAccountId: event.connectedStripeAccountId,
    });
    await this.firestoreDataService.ticketPaymentSessions.create(
      paymentSheet.paymentIntentId,
      new TicketPaymentSession({
        userId: dto.userId,
        status: 'requires_payment_method',
        revenue,
        serviceFeeAmount,
        promotionCodeAmountOff,
        promotionCode: dto.promotionCode,
        stripeCustomerId: paymentSheet.customerId,
        sendInvoice: dto.sendInvoice,
        eventId: event.id,
        ticketQuantity: dto.quantity,
        connectedStripeAccountId: event.connectedStripeAccountId
          ? event.connectedStripeAccountId
          : null,
      }),
    );
    return paymentSheet;
  }

  async cancelTicketReservation(dto: CancelTicketReservationDto) {
    return;
  }

  getServiceFee() {
    return this.appConfigService.getServiceFee();
  }

  getEventFees(): EventFees {
    const normalEventFee = this.appConfigService.getNormalEventFee();
    const exclusiveEventFee = this.appConfigService.getExclusiveEventFee();
    return { normal: normalEventFee, exclusive: exclusiveEventFee };
  }

  private async getPromotionCode(
    userId: string,
    code: string,
  ): Promise<PromotionCode> {
    const promotionCode =
      await this.firestoreDataService.promotionCodes.findById(userId, code);
    if (!promotionCode) {
      const response: PaymentFailure = 'invalid-promotion-code';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }
    if (!promotionCode.isValid) {
      const response: PaymentFailure = 'promotion-code-expired';
      throw new HttpException(response, HttpStatus.GONE);
    }
    return promotionCode;
  }

  private async createPaymentSheetForUser({
    amount,
    description,
    currency,
    userId,
    connectedAccountId,
  }: CreatePaymentSheetForUserParams): Promise<PaymentSheet> {
    const stripeCustomer =
      await this.firestoreDataService.stripeCustomers.findById(userId);
    if (!stripeCustomer) {
      const response = 'invalid-stripe-customer';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }
    const ephemeralKeySecret = await this.tryCreateEphemeralKey(
      stripeCustomer.customerId,
    );
    const paymentMethodTypes = PaymentsService.getPaymentMethodTypes(
      currency,
      stripeCustomer.paymentMethod,
    );
    const paymentIntentAmount = PaymentsService.getPaymentIntentAmount(amount);
    const paymentIntent = await this.stripe.paymentIntents.create({
      currency,
      description,
      amount: paymentIntentAmount,
      customer: stripeCustomer.customerId,
      payment_method_types: paymentMethodTypes,
      receipt_email: stripeCustomer.email ? stripeCustomer.email : undefined,
      transfer_data: connectedAccountId
        ? {
            destination: connectedAccountId,
          }
        : undefined,
    });
    if (!paymentIntent.client_secret) {
      throw new HttpException(
        'Error creating payment intent',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      customerId: stripeCustomer.customerId,
      ephemeralKeySecret,
      paymentIntentSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  private static getPaymentSheetAmount({
    revenue,
    serviceFeeAmount,
    promotionCodeAmountOff,
  }: GetTicketPaymentSheetAmountParams) {
    let amount = 0;
    amount += revenue;
    amount += serviceFeeAmount;
    amount -= promotionCodeAmountOff;
    return amount;
  }

  private getServiceFeeAmount(amount: number, currency: string) {
    const fee = this.appConfigService.getServiceFee();
    const minFeeAmount = PaymentsService.getMinimalFeeAmount(currency);
    return minFeeAmount + amount * fee;
  }

  private static getMinimalFeeAmount(currency: string) {
    // TODO - get from currency params
    if (currency.toUpperCase() === 'PLN') {
      return 0;
    }
    return 0;
  }

  private static getPaymentIntentAmount(amount: number) {
    // TODO - add currency support
    return Math.round(amount * 100);
  }

  private static getPaymentMethodTypes(
    currency: string,
    customerPaymentMethod?: string,
  ): Stripe.Checkout.SessionCreateParams.PaymentMethodType[] {
    if (customerPaymentMethod === 'card') {
      return ['card'];
    }

    if (PaymentsService.isSupportedCurrencyForP24(currency)) {
      return ['card', 'p24'];
    }

    return ['card'];
  }

  private static isSupportedCurrencyForP24(currency: string) {
    return currency.toUpperCase() === 'PLN' || currency.toUpperCase() === 'EUR';
  }

  private async tryCreateEphemeralKey(customerId: string): Promise<string> {
    const ephemeralKey = await this.stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: apiVersion },
    );

    if (!ephemeralKey.secret) {
      throw new HttpException(
        'Error creating ephemeral key',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return ephemeralKey.secret;
  }
}

interface GetTicketPaymentSheetAmountParams {
  revenue: number;
  serviceFeeAmount: number;
  promotionCodeAmountOff: number;
}

export interface CreatePaymentSheetForUserParams {
  amount: number;
  description: string;
  currency: string;
  userId: string;
  connectedAccountId: string;
}
