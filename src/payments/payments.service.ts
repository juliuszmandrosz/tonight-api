import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventsService } from '@events/events.service';
import { PaymentSheet } from '@payments/interfaces/payment.sheet.interface';
import { CreateTicketPaymentSheetDto } from '@payments/dtos/create-ticket-payment-sheet.dto';
import { EventTicketsService } from '@event-tickets/services/event-tickets.service';
import { PromotionCode } from '@payments/entities/promotion-code.entity';
import { Stripe } from 'stripe';
import { InjectStripe } from 'nestjs-stripe';
import { apiVersion } from '@constants/stripe-constants';
import { TicketPaymentSession } from '@payments/entities/ticket-payment-session.entity';
import { FirestoreDataService } from '@data-services/firestore/firestore-data.service';
import { AppConfigService } from '@config/app-config.service';
import { PaymentFailure } from '@payments/types/payment-failure.type';
import { CloudTasksService } from '@cloud-tasks/cloud-tasks.service';
import { CancelTicketReservationDto } from '@payments/dtos/cancel-ticket-reservation.dto';
import { CreateVipPaymentSheetDto } from '@payments/dtos/create-vip-payment-sheet.dto';
import { VipPaymentSession } from '@payments/entities/vip-payment-session.entity';
import { EventFailure } from '@events/event-failure.type';

@Injectable()
export class PaymentsService {
  constructor(
    private eventService: EventsService,
    private eventTicketsService: EventTicketsService,
    private firestoreDataService: FirestoreDataService,
    private appConfigService: AppConfigService,
    private cloudTasksService: CloudTasksService,
    @InjectStripe() private stripe: Stripe,
  ) {}

  async createTicketPaymentSheet(
    dto: CreateTicketPaymentSheetDto,
  ): Promise<PaymentSheet> {
    const event = await this.eventService.checkIfEventIsActive(dto.eventId);

    await this.checkIfUserAlreadyHasTicketForEvent(dto.userId, dto.eventId);

    await this.cancelExistingPaymentSession(dto.eventId, dto.userId);

    await this.eventTicketsService.checkIfEventIsSoldOut(
      event.clubId,
      event.id,
    );

    const vipPrice = dto.isVip
      ? await this.eventTicketsService.getVipPrice(event.clubId, event.id)
      : 0;

    if (dto.isVip && !vipPrice) {
      const response: PaymentFailure = 'vip-no-longer-available';
      throw new HttpException(response, HttpStatus.GONE);
    }

    const serviceFeeAmount = this.getServiceFeeAmount(
      event.price + vipPrice,
      event.currency,
    );

    const promotionCodeAmountOff = dto.promotionCode
      ? await this.getPromotionCode(dto.userId, dto.promotionCode).then(
          (code) => code.amountOff,
        )
      : 0;

    const revenue = event.price + vipPrice;

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
    });

    const cancelTicketReservationTaskId =
      await this.createCancelTicketReservationTask(
        paymentSheet.paymentIntentId,
      );

    await this.firestoreDataService.ticketPaymentSessions.create(
      paymentSheet.paymentIntentId,
      new TicketPaymentSession({
        userId: dto.userId,
        status: 'requires_payment_method',
        revenue,
        isVip: dto.isVip,
        serviceFeeAmount,
        promotionCodeAmountOff,
        promotionCode: dto.promotionCode,
        stripeCustomerId: paymentSheet.customerId,
        sendInvoice: dto.sendInvoice,
        cancelTicketReservationTaskId,
        eventId: event.id,
      }),
    );

    const updatedTicketPrice =
      await this.eventTicketsService.updateEventTicketsOnTicketPayment(
        event,
        dto.isVip,
      );

    await this.eventService.updateEventOnTicketPayment(
      event.id,
      updatedTicketPrice,
    );

    return paymentSheet;
  }

  async createVipPaymentSheet(
    dto: CreateVipPaymentSheetDto,
  ): Promise<PaymentSheet> {
    const ticket = await this.firestoreDataService.tickets.findById(
      dto.userId,
      dto.ticketId,
    );

    if (!ticket) {
      throw new HttpException('invalid-ticket', HttpStatus.NOT_FOUND);
    }

    if (ticket.isVip) {
      const response: PaymentFailure = 'ticket-already-has-vip';
      throw new HttpException(response, HttpStatus.CONFLICT);
    }

    const event = await this.eventService.checkIfEventIsActive(ticket.eventId);

    const vipPrice = await this.eventTicketsService.getVipPrice(
      event.clubId,
      event.id,
    );

    if (!vipPrice) {
      const response: PaymentFailure = 'vip-no-longer-available';
      throw new HttpException(response, HttpStatus.GONE);
    }

    const serviceFeeAmount = this.getServiceFeeAmount(vipPrice, event.currency);

    const promotionCodeAmountOff = dto.promotionCode
      ? await this.getPromotionCode(dto.userId, dto.promotionCode).then(
          (code) => code.amountOff,
        )
      : 0;

    const paymentSheetAmount = PaymentsService.getPaymentSheetAmount({
      revenue: vipPrice,
      serviceFeeAmount: serviceFeeAmount,
      promotionCodeAmountOff: promotionCodeAmountOff,
    });

    const paymentSheet = await this.createPaymentSheetForUser({
      amount: paymentSheetAmount,
      description: event.eventName,
      currency: event.currency,
      userId: dto.userId,
    });

    await this.firestoreDataService.vipPaymentSessions.create(
      paymentSheet.paymentIntentId,
      new VipPaymentSession({
        userId: dto.userId,
        status: 'requires_payment_method',
        revenue: vipPrice,
        serviceFeeAmount,
        promotionCodeAmountOff,
        promotionCode: dto.promotionCode,
        stripeCustomerId: paymentSheet.customerId,
        sendInvoice: dto.sendInvoice,
        eventId: event.id,
        ticketId: dto.ticketId,
      }),
    );

    return paymentSheet;
  }

  async cancelTicketReservation(dto: CancelTicketReservationDto) {
    const session =
      await this.firestoreDataService.ticketPaymentSessions.findById(
        dto.ticketPaymentSessionId,
      );

    if (!session) {
      const response = 'invalid-ticket-payment-session';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }

    if (session.status === 'canceled') return;

    await this.cloudTasksService.deleteCloudTask(
      session.cancelTicketReservationTaskId,
    );

    session.status = 'canceled';

    await this.firestoreDataService.ticketPaymentSessions.update(
      session.id,
      session,
    );

    const event = await this.firestoreDataService.events.findById(
      session.eventId,
    );

    if (!event) {
      const response: EventFailure = 'invalid-event';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }

    const updatedTicketPrice =
      await this.eventTicketsService.updateEventTicketsOnCancelReservation({
        event,
        isVip: session.isVip,
        canceledAmount: session.revenue,
      });

    await this.eventService.updateEventOnCancelReservation(
      event.id,
      updatedTicketPrice,
    );
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

  private async createCancelTicketReservationTask(
    ticketPaymentSessionId: string,
  ) {
    const payload: CancelTicketReservationDto = {
      ticketPaymentSessionId,
    };

    return this.cloudTasksService.createCloudTask<CancelTicketReservationDto>({
      executionTimeInSeconds: 600,
      payload,
      callbackName: 'cancelTicketReservationOnCloudTaskCallback',
      queueName: 'cancel-ticket-reservation',
    });
  }

  private async createPaymentSheetForUser({
    amount,
    description,
    currency,
    userId,
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
    const paymentMethodTypes = PaymentsService.getPaymentMethodTypes(currency);
    const paymentIntentAmount = PaymentsService.getPaymentIntentAmount(amount);

    const paymentIntent = await this.stripe.paymentIntents.create({
      currency,
      description,
      amount: paymentIntentAmount,
      customer: stripeCustomer.customerId,
      payment_method_types: paymentMethodTypes,
      receipt_email: stripeCustomer.email,
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
      return 1;
    }

    return 0;
  }

  private static getPaymentIntentAmount(amount: number) {
    // TODO - add currency support
    return Math.round(amount * 100);
  }

  private static getPaymentMethodTypes(currency: string) {
    if (currency.toUpperCase() === 'PLN' || currency.toUpperCase() === 'EUR') {
      return ['card', 'p24'];
    }

    return ['card'];
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

  private async cancelExistingPaymentSession(eventId: string, userId: string) {
    const existingTicketPaymentSession =
      await this.firestoreDataService.ticketPaymentSessions.findOneByParams([
        { fieldName: 'eventId', operator: '==', fieldValue: eventId },
        { fieldName: 'userId', operator: '==', fieldValue: userId },
        {
          fieldName: 'status',
          operator: 'in',
          fieldValue: ['requires_payment_method', 'requires_action'],
        },
      ]);

    if (existingTicketPaymentSession) {
      await this.cancelTicketReservation({
        ticketPaymentSessionId: existingTicketPaymentSession.id,
      });
    }
  }

  private async checkIfUserAlreadyHasTicketForEvent(
    userId: string,
    eventId: string,
  ) {
    const existingTicket =
      await this.firestoreDataService.tickets.findOneByField(
        userId,
        'eventId',
        eventId,
      );

    if (existingTicket) {
      const response: PaymentFailure = 'user-already-has-ticket';
      throw new HttpException(response, HttpStatus.CONFLICT);
    }
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
}
