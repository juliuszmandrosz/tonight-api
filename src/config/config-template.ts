export interface ConfigTemplate {
  port: number;
  serviceFee: number;
  normalEventFee: number;
  exclusiveEventFee: number;
  cloudFunctions: CloudFunctionsConfig;
  stripe: StripeConfig;
  firestore: FirestoreConfig;
  typesense: TypesenseConfig;
  googlePlaces: GooglePlacesConfig;
  shopify: ShopifyConfig;
}

export interface CloudFunctionsConfig {
  endpoint: string;
  location: string;
}

export interface StripeConfig {
  apiVersion: string;
  apiKey: string;
}

export interface ShopifyConfig {
  apiKey: string;
  accessToken: string;
  shopName: string;
}

export interface FirestoreConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface TypesenseConfig {
  apiKey: string;
  clusterId: string;
}

export interface GooglePlacesConfig {
  apiKey: string;
}
