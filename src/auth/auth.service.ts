import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FirestoreAuthProvider } from '@firestore/firestore-providers';
import { CheckClaimDto } from '@auth/dtos/check-claim.dto';
import { Auth } from 'firebase-admin/auth';
import { FirestoreDataService } from '@data-services/firestore/firestore-data.service';
import { AddUserDto } from '@auth/dtos/add-user.dto';
import { User } from '@auth/entities/user.entity';
import { Stripe } from 'stripe';
import { StripeCustomer } from '@payments/entities/stripe-customer.entity';
import { AuthFailure } from '@auth/types/auth.failure.type';
import { firestore } from 'firebase-admin';
import { CheckIfPartnerCanSignInDto } from '@auth/dtos/check-if-partner-can-sign-in.dto';
import { AddPartnerDto } from '@auth/dtos/add-partner.dto';
import { Partner } from '@auth/entities/partner.entity';
import { PartnerAccessCode } from '@auth/entities/partner-access-code.entity';
import { SelectorAccessCode } from '@auth/entities/selector-access-code.entity';
import { AddSelectorDto } from '@auth/dtos/add-selector.dto';
import { Selector } from '@auth/entities/selector.entity';
import { ClubSelector } from '@auth/entities/club-selector.entity';
import { CheckIfSelectorCanSignInDto } from '@auth/dtos/check-if-selector-can-sign-in.dto';
import { CustomClaims } from '@auth/interfaces/custom-claims.interface';
import { DeleteAccountDto } from '@auth/dtos/delete-account.dto';
import { StripeProvider } from '../stripe/stripe-providers';
import Timestamp = firestore.Timestamp;

@Injectable()
export class AuthService {
  constructor(
    @Inject(FirestoreAuthProvider) private firebaseAuth: Auth,
    @Inject(StripeProvider) private stripe: Stripe,
    private firestoreDataService: FirestoreDataService,
  ) {}

  async checkIfUserCanSignIn(dto: CheckClaimDto) {
    const account = await this.checkIfEmailExists(dto.email);

    if (!account) return;

    await this.checkUserClaim(dto.email);
  }

  async checkIfPartnerCanSignIn(dto: CheckIfPartnerCanSignInDto) {
    const account = await this.checkIfEmailExists(dto.email);

    if (account) {
      await this.checkPartnerClaim(dto.email);
      return;
    }

    if (!dto.accessCode) {
      const response: AuthFailure = 'not-found';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }

    await this.checkPartnerAccessCode(dto.accessCode);
  }

  async checkIfSelectorCanSignIn(dto: CheckIfSelectorCanSignInDto) {
    const account = await this.checkIfEmailExists(dto.email);

    if (account) {
      await this.checkSelectorClaim(dto.email);
      return;
    }

    if (!dto.accessCode) {
      const response: AuthFailure = 'not-found';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }

    await this.checkSelectorAccessCode(dto.accessCode);
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
        email: dto.email ? dto.email.toLowerCase() : '',
        phoneNumber: dto.phoneNumber ? dto.phoneNumber : '',
        username: '',
        favoriteEventIds: [],
        favoriteClubIds: [],
        attendance: {},
        locale: dto.locale,
      }),
    );

    await this.addStripeCustomer({
      email: dto.email,
      phone: dto.phoneNumber,
      accountId: dto.userId,
      locale: dto.locale,
    });

    await this.firebaseAuth.setCustomUserClaims(dto.userId, {
      isUser: true,
    } as CustomClaims);
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

    await this.firebaseAuth.setCustomUserClaims(dto.partnerId, {
      isPartner: true,
    } as CustomClaims);
  }

  async addSelector(dto: AddSelectorDto) {
    const selector = await this.firestoreDataService.selectors.findById(
      dto.selectorId,
    );

    if (selector) {
      const response: AuthFailure = 'already-exists';
      throw new HttpException(response, HttpStatus.CONFLICT);
    }

    const accessCode = await this.useSelectorAccessCode(dto.accessCode);

    await this.firestoreDataService.clubSelectors.create(
      accessCode.clubId,
      dto.selectorId,
      new ClubSelector({ email: dto.email.toLowerCase() }),
    );

    await this.firestoreDataService.selectors.create(
      dto.selectorId,
      new Selector({
        email: dto.email.toLowerCase(),
        clubId: accessCode.clubId,
      }),
    );

    await this.firebaseAuth.setCustomUserClaims(dto.selectorId, {
      isSelector: true,
    } as CustomClaims);
  }

  async deleteAccount(dto: DeleteAccountDto) {
    const account = dto.email
      ? await this.checkIfEmailExists(dto.email)
      : await this.checkIfUserExists(dto.accountId);
    if (!account) {
      const response: AuthFailure = 'not-found';
      throw new HttpException(response, HttpStatus.NOT_ACCEPTABLE);
    }
    await this.firebaseAuth.deleteUser(dto.accountId);
  }

  private async checkIfEmailExists(email: string) {
    try {
      await this.firebaseAuth.getUserByEmail(email.toLowerCase());
      return true;
    } catch {
      return false;
    }
  }

  private async checkIfUserExists(id: string) {
    try {
      await this.firebaseAuth.getUser(id);
      return true;
    } catch {
      return false;
    }
  }

  private async addStripeCustomer({
    accountId,
    email,
    phone,
    locale,
  }: AddStripeCustomerParams) {
    const customer = await this.stripe.customers.create({
      email: email ? email.toLowerCase() : '',
      phone: phone ? phone : '',
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
        email: email ? email.toLowerCase() : '',
        phoneNumber: phone ? phone : '',
      }),
    );
  }

  private async checkPartnerClaim(email: string) {
    const claims = await this.getAccountClaims(email);

    if (!claims?.isPartner) {
      const response: AuthFailure = 'permission-denied';
      throw new HttpException(response, HttpStatus.FORBIDDEN);
    }
  }

  private async checkUserClaim(email: string) {
    const claims = await this.getAccountClaims(email);

    if (!claims?.isUser) {
      const response: AuthFailure = 'permission-denied';
      throw new HttpException(response, HttpStatus.FORBIDDEN);
    }
  }

  private async checkSelectorClaim(email: string) {
    const claims = await this.getAccountClaims(email);

    if (!claims?.isSelector) {
      const response: AuthFailure = 'permission-denied';
      throw new HttpException(response, HttpStatus.FORBIDDEN);
    }
  }

  private async checkPartnerAccessCode(code: string) {
    const accessCode =
      await this.firestoreDataService.partnersAccessCodes.findById(code);

    AuthService.checkIfAccessCodeIsValid(accessCode);
  }

  private async checkSelectorAccessCode(code: string) {
    const accessCode =
      await this.firestoreDataService.selectorsAccessCodes.findById(code);

    AuthService.checkIfAccessCodeIsValid(accessCode);
  }

  private static checkIfAccessCodeIsValid(
    code: PartnerAccessCode | SelectorAccessCode,
  ) {
    if (!code) {
      const response: AuthFailure = 'invalid-access-code';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }

    if (Timestamp.now().toMillis() >= code.expirationDateTime.toMillis()) {
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

  private async useSelectorAccessCode(code: string) {
    const accessCode =
      await this.firestoreDataService.selectorsAccessCodes.findById(code);

    if (!accessCode) {
      const response: AuthFailure = 'invalid-access-code';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }

    await this.firestoreDataService.selectorsAccessCodes.delete(code);

    return accessCode;
  }

  private async getAccountClaims(email: string) {
    const userRecord = await this.firebaseAuth.getUserByEmail(email);

    return userRecord.customClaims as CustomClaims;
  }
}

interface AddStripeCustomerParams {
  accountId: string;
  locale: string;
  email?: string;
  phone?: string;
}
