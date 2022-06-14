import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FirestoreAuthProvider } from '@firestore/firestore-providers';
import { CheckClaimDto } from '@auth/dtos/check-claim.dto';
import { Auth, fetchSignInMethodsForEmail } from 'firebase/auth';
import { FirestoreDataService } from '@data-services/firestore/firestore-data.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(FirestoreAuthProvider) private firebaseAuth: Auth,
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

  private async checkIfAccountExists(email: string): Promise<boolean> {
    const providers = await fetchSignInMethodsForEmail(
      this.firebaseAuth,
      email,
    );

    return providers.length > 0;
  }
}
