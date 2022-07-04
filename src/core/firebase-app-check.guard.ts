import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { FirestoreAppCheckProvider } from '@firestore/firestore-providers';
import { appCheck } from 'firebase-admin';
import AppCheck = appCheck.AppCheck;

@Injectable()
export class FirebaseAppCheckGuard implements CanActivate {
  constructor(
    @Inject(FirestoreAppCheckProvider) private firebaseAppCheck: AppCheck,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-firebase-app-check'];
    return this.validateRequest(token);
  }

  async validateRequest(token: string) {
    try {
      await this.firebaseAppCheck.verifyToken(token);
      return true;
    } catch {
      return false;
    }
  }
}
