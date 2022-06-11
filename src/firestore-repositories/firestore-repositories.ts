import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Event } from '@events/event-entity';
import { FirestoreDatabaseProvider } from '@core/firestore-providers';
import { FirestoreCollectionRepository } from '@firestore-repositories/firestore-collection-repository';
import { StripeCustomer } from '@payments/entities/stripe-customer-entity';
import { TicketPaymentSession } from '@payments/entities/ticket-payment-session-entity';
import { Firestore } from 'firebase/firestore/lite';
import { EventTickets } from '@event-tickets/entities/event-tickets-entity';
import { FirestoreSubcollectionRepository } from '@firestore-repositories/firestore-subcollection-repository';
import { PromotionCode } from '@payments/entities/promotion-code-entity';

@Injectable()
export class FirestoreRepositories implements OnApplicationBootstrap {
  events: FirestoreCollectionRepository<Event>;
  stripeCustomers: FirestoreCollectionRepository<StripeCustomer>;
  ticketPaymentSessions: FirestoreCollectionRepository<TicketPaymentSession>;
  eventTickets: FirestoreSubcollectionRepository<EventTickets>;
  promotionCodes: FirestoreSubcollectionRepository<PromotionCode>;

  constructor(@Inject(FirestoreDatabaseProvider) private db: Firestore) {}

  onApplicationBootstrap() {
    this.events = new FirestoreCollectionRepository<Event>(
      this.db,
      Event.collectionName,
    );

    this.stripeCustomers = new FirestoreCollectionRepository<StripeCustomer>(
      this.db,
      StripeCustomer.collectionName,
    );

    this.ticketPaymentSessions =
      new FirestoreCollectionRepository<TicketPaymentSession>(
        this.db,
        TicketPaymentSession.collectionName,
      );

    this.eventTickets = new FirestoreSubcollectionRepository<EventTickets>(
      this.db,
      EventTickets.parentCollectionName,
      EventTickets.subCollectionName,
    );

    this.promotionCodes = new FirestoreSubcollectionRepository<PromotionCode>(
      this.db,
      PromotionCode.parentCollectionName,
      PromotionCode.subCollectionName,
    );
  }
}
