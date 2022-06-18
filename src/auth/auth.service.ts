import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FirestoreAuthProvider } from '@firestore/firestore-providers';
import { CheckClaimDto } from '@auth/dtos/check-claim.dto';
import { Auth, fetchSignInMethodsForEmail } from 'firebase/auth';
import { FirestoreDataService } from '@data-services/firestore/firestore-data.service';
import { AddUserDto } from '@auth/dtos/add-user.dto';
import { User } from '@auth/entities/user.entity';
import { InjectStripe } from 'nestjs-stripe';
import { Stripe } from 'stripe';
import { StripeCustomer } from '@payments/entities/stripe-customer.entity';
import { AuthFailure } from '@auth/types/auth.failure.type';
import { firestore } from 'firebase-admin';
import Timestamp = firestore.Timestamp;
import { CheckIfPartnerCanSignUpDto } from '@auth/dtos/check-if-partner-can-sign-up.dto';
import { AddPartnerDto } from '@auth/dtos/add-partner.dto';
import { Partner } from '@auth/entities/partner.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(FirestoreAuthProvider) private firebaseAuth: Auth,
    @InjectStripe() private stripe: Stripe,
    private firestoreDataService: FirestoreDataService,
  ) {}

  async checkIfUserCanSignIn(dto: CheckClaimDto) {
    const account = await this.checkIfAccountExists(dto.email);

    if (!account) return;

    await this.checkUserClaim(dto.email);
  }

  async checkIfPartnerCanSignIn(dto: CheckClaimDto) {
    const account = await this.checkIfAccountExists(dto.email);

    if (!account) {
      const response: AuthFailure = 'not-found';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }

    await this.checkPartnerClaim(dto.email);
  }

  async checkIfPartnerCanSignUp(dto: CheckIfPartnerCanSignUpDto) {
    if (await this.checkIfAccountExists(dto.email)) {
      const response: AuthFailure = 'already-exists';
      throw new HttpException(response, HttpStatus.CONFLICT);
    }

    await this.checkPartnerAccessCode(dto.accessCode);
  }

  async addUser(dto: AddUserDto) {
    const user = await this.firestoreDataService.users.findById(dto.userId);

    if (user) {
      const response: AuthFailure = 'already-exists';
      throw new HttpException(response, HttpStatus.CONFLICT);
    }

    await this.firestoreDataService.users.create(
      dto.userId,
      new User({
        email: dto.email.toLowerCase(),
        username: '',
        favoriteEventIds: [],
        favoriteClubIds: [],
        attendance: {},
      }),
    );

    await this.addStripeCustomer({
      email: dto.email,
      accountId: dto.userId,
      locale: dto.locale,
    });
  }

  async addPartner(dto: AddPartnerDto) {
    const partner = await this.firestoreDataService.partners.findById(
      dto.partnerId,
    );

    if (partner) {
      const response: AuthFailure = 'already-exists';
      throw new HttpException(response, HttpStatus.CONFLICT);
    }

    const accessCode = await this.usePartnerAccessCode(dto.accessCode);

    await this.firestoreDataService.partners.create(
      dto.partnerId,
      new Partner({
        email: dto.email.toLowerCase(),
        clubId: accessCode.clubId,
      }),
    );

    await this.addStripeCustomer({
      email: dto.email,
      accountId: dto.partnerId,
      locale: dto.locale,
    });
  }

  async checkPartnerClaim(email: string) {
    const partner = await this.firestoreDataService.partners.findOneByField(
      'email',
      email.toLowerCase(),
    );

    if (!partner) {
      const response: AuthFailure = 'permission-denied';
      throw new HttpException(response, HttpStatus.FORBIDDEN);
    }
  }

  private async checkIfAccountExists(email: string) {
    const providers = await fetchSignInMethodsForEmail(
      this.firebaseAuth,
      email.toLowerCase(),
    );

    return providers.length > 0;
  }

  private async addStripeCustomer({
    accountId,
    email,
    locale,
  }: AddStripeCustomerParams) {
    const customer = await this.stripe.customers.create({
      email: email.toLowerCase(),
      preferred_locales: [locale],
    });

    const intent = await this.stripe.setupIntents.create({
      customer: customer.id,
    });

    await this.firestoreDataService.stripeCustomers.create(
      accountId,
      new StripeCustomer({
        customerId: customer.id,
        setupSecret: intent.client_secret,
        email,
      }),
    );
  }

  private async checkUserClaim(email: string) {
    const user = await this.firestoreDataService.users.findOneByField(
      'email',
      email.toLowerCase(),
    );

    if (!user) {
      const response: AuthFailure = 'permission-denied';
      throw new HttpException(response, HttpStatus.FORBIDDEN);
    }
  }

  private async checkPartnerAccessCode(code: string) {
    const accessCode =
      await this.firestoreDataService.partnersAccessCodes.findById(code);

    if (!accessCode) {
      const response: AuthFailure = 'invalid-access-code';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }

    if (
      Timestamp.now().toMillis() >= accessCode.expirationDateTime.toMillis()
    ) {
      const response: AuthFailure = 'invalid-access-code';
      throw new HttpException(response, HttpStatus.GONE);
    }
  }

  private async usePartnerAccessCode(code: string) {
    const accessCode =
      await this.firestoreDataService.partnersAccessCodes.findById(code);

    if (!accessCode) {
      const response: AuthFailure = 'invalid-access-code';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }

    await this.firestoreDataService.partnersAccessCodes.delete(code);

    return accessCode;
  }
}

interface AddStripeCustomerParams {
  accountId: string;
  email: string;
  locale: string;
}
