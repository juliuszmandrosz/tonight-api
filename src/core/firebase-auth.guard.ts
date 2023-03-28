import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FirestoreAuthProvider } from '@firestore/firestore-providers';
import { auth } from 'firebase-admin';
import Auth = auth.Auth;

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(@Inject(FirestoreAuthProvider) private firebaseAuth: Auth) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-firebase-id-token'];
    return Promise.resolve(true);
    return this.validateRequest(token);
  }

  async validateRequest(token: string) {
    try {
      await this.firebaseAuth.verifyIdToken(token);
      return true;
    } catch {
      return false;
    }
  }
}
