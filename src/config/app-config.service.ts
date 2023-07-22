import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CloudFunctionsConfig,
  FirestoreConfig,
  GooglePlacesConfig,
  ShopifyConfig,
  StripeConfig,
  TypesenseConfig,
} from '@config/config-template';
import {
  cloudFunctions,
  exclusiveEventFee,
  firestore,
  googlePlaces,
  normalEventFee,
  port,
  serviceFee,
  shopify,
  stripe,
  typesense,
} from '@config/config-keys';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  getPort() {
    return this.configService.get<number>(port);
  }

  getServiceFee() {
    return this.configService.get<number>(serviceFee);
  }

  getNormalEventFee() {
    return this.configService.get<number>(normalEventFee);
  }

  getExclusiveEventFee() {
    return this.configService.get<number>(exclusiveEventFee);
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

  getTypesenseConfig() {
    return this.configService.get<TypesenseConfig>(typesense);
  }

  getGooglePlacesConfig() {
    return this.configService.get<GooglePlacesConfig>(googlePlaces);
  }

  getShopifyConfig() {
    return this.configService.get<ShopifyConfig>(shopify);
  }
}
