import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Event } from '@events/event.entity';
import { StripeCustomer } from '@payments/entities/stripe-customer.entity';
import { TicketPaymentSession } from '@payments/entities/ticket-payment-session.entity';
import { Firestore } from 'firebase/firestore/lite';
import { EventTickets } from '@event-tickets/entities/event-tickets.entity';
import { FirestoreSubcollectionRepository } from './firestore-subcollection-repository';
import { PromotionCode } from '@payments/entities/promotion-code.entity';
import { FirestoreCollectionRepository } from './firestore-collection-repository';
import { FirestoreDatabaseProvider } from '@firestore/firestore-providers';
import { User } from '@auth/entities/user.entity';
import { Ticket } from '@payments/entities/ticket.entity';
import { VipPaymentSession } from '@payments/entities/vip-payment-session.entity';
import { Partner } from '@auth/entities/partner.entity';
import { PartnerAccessCode } from '@auth/entities/partner-access-code.entity';
import { SelectorAccessCode } from '@auth/entities/selector-access-code.entity';
import { Selector } from '@auth/entities/selector.entity';
import { ClubSelector } from '@auth/entities/club-selector.entity';

@Injectable()
export class FirestoreDataService implements OnApplicationBootstrap {
  events: FirestoreCollectionRepository<Event>;
  stripeCustomers: FirestoreCollectionRepository<StripeCustomer>;
  ticketPaymentSessions: FirestoreCollectionRepository<TicketPaymentSession>;
  eventTickets: FirestoreSubcollectionRepository<EventTickets>;
  promotionCodes: FirestoreSubcollectionRepository<PromotionCode>;
  users: FirestoreCollectionRepository<User>;
  tickets: FirestoreSubcollectionRepository<Ticket>;
  vipPaymentSessions: FirestoreCollectionRepository<VipPaymentSession>;
  partners: FirestoreCollectionRepository<Partner>;
  partnersAccessCodes: FirestoreCollectionRepository<PartnerAccessCode>;
  selectorsAccessCodes: FirestoreCollectionRepository<SelectorAccessCode>;
  selectors: FirestoreCollectionRepository<Selector>;
  clubSelectors: FirestoreSubcollectionRepository<ClubSelector>;

  constructor(
    @Inject(FirestoreDatabaseProvider) private firestore: Firestore,
  ) {}

  onApplicationBootstrap() {
    this.events = new FirestoreCollectionRepository<Event>(
      this.firestore,
      Event.collectionName,
    );

    this.stripeCustomers = new FirestoreCollectionRepository<StripeCustomer>(
      this.firestore,
      StripeCustomer.collectionName,
    );

    this.ticketPaymentSessions =
      new FirestoreCollectionRepository<TicketPaymentSession>(
        this.firestore,
        TicketPaymentSession.collectionName,
      );

    this.eventTickets = new FirestoreSubcollectionRepository<EventTickets>(
      this.firestore,
      EventTickets.parentCollectionName,
      EventTickets.subCollectionName,
    );

    this.promotionCodes = new FirestoreSubcollectionRepository<PromotionCode>(
      this.firestore,
      PromotionCode.parentCollectionName,
      PromotionCode.subCollectionName,
    );

    this.users = new FirestoreCollectionRepository<User>(
      this.firestore,
      User.collectionName,
    );

    this.tickets = new FirestoreSubcollectionRepository<Ticket>(
      this.firestore,
      Ticket.parentCollectionName,
      Ticket.subCollectionName,
    );

    this.vipPaymentSessions =
      new FirestoreCollectionRepository<VipPaymentSession>(
        this.firestore,
        VipPaymentSession.collectionName,
      );

    this.partners = new FirestoreCollectionRepository<Partner>(
      this.firestore,
      Partner.collectionName,
    );

    this.partnersAccessCodes =
      new FirestoreCollectionRepository<PartnerAccessCode>(
        this.firestore,
        PartnerAccessCode.collectionName,
      );

    this.selectorsAccessCodes =
      new FirestoreCollectionRepository<SelectorAccessCode>(
        this.firestore,
        SelectorAccessCode.collectionName,
      );

    this.selectors = new FirestoreCollectionRepository<Selector>(
      this.firestore,
      Selector.collectionName,
    );

    this.clubSelectors = new FirestoreSubcollectionRepository<ClubSelector>(
      this.firestore,
      ClubSelector.parentCollectionName,
      ClubSelector.subCollectionName,
    );
  }
}
