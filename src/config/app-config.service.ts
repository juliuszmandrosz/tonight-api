import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CloudFunctionsConfig,
  FirestoreConfig,
  StripeConfig,
} from '@config/config-template';
import {
  cloudFunctions,
  firestore,
  serviceFee,
  stripe,
} from '@config/config-keys';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  getServiceFee() {
    return this.configService.get<number>(serviceFee);
  }

  getCloudFunctionsConfig() {
    return this.configService.get<CloudFunctionsConfig>(cloudFunctions);
  }

  getFirestoreConfig() {
    return this.configService.get<FirestoreConfig>(firestore);
  }

  getStripeConfig() {
    return this.configService.get<StripeConfig>(stripe);
  }
}
