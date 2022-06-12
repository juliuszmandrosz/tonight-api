import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirestoreConfig, StripeConfig } from '@config/config-template';
import { firestore, serviceFee, stripe } from '@config/config-keys';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  getServiceFee() {
    return this.configService.get<number>(serviceFee);
  }

  getFirestoreConfig() {
    return this.configService.get<FirestoreConfig>(firestore);
  }

  getStripeConfig() {
    return this.configService.get<StripeConfig>(stripe);
  }
}
