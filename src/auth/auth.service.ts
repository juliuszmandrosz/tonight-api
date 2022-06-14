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

@Injectable()
export class AuthService {
  constructor(
    @Inject(FirestoreAuthProvider) private firebaseAuth: Auth,
    @InjectStripe() private stripe: Stripe,
    private firestoreDataService: FirestoreDataService,
  ) {}

  async checkUserClaim(dto: CheckClaimDto) {
    const account = await this.checkIfAccountExists(dto.email);

    if (!account) return;

    const user = await this.firestoreDataService.users.findOneByField(
      'email',
      dto.email,
    );

    if (!user) {
      throw new HttpException('permission-denied', HttpStatus.FORBIDDEN);
    }
  }

  async addUser(dto: AddUserDto) {
    const user = await this.firestoreDataService.users.findById(dto.userId);

    if (user) {
      throw new HttpException('already-exists', HttpStatus.CONFLICT);
    }

    await this.firestoreDataService.users.create(
      dto.userId,
      new User({
        email: dto.email,
        username: '',
        favoriteEventIds: [],
        favoriteClubIds: [],
        attendance: {},
      }),
    );

    await this.addStripeCustomer(dto);
  }

  private async checkIfAccountExists(email: string): Promise<boolean> {
    const providers = await fetchSignInMethodsForEmail(
      this.firebaseAuth,
      email,
    );

    return providers.length > 0;
  }

  private async addStripeCustomer(dto: AddUserDto) {
    const customer = await this.stripe.customers.create({
      email: dto.email,
      preferred_locales: [dto.locale],
    });

    const intent = await this.stripe.setupIntents.create({
      customer: customer.id,
    });

    await this.firestoreDataService.stripeCustomers.create(
      dto.userId,
      new StripeCustomer({
        customerId: customer.id,
        setupSecret: intent.client_secret,
        email: dto.email,
      }),
    );
  }
}
