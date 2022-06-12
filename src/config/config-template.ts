export interface ConfigTemplate {
  serviceFee: number;
  cloudFunctions: CloudFunctionsConfig;
  stripe: StripeConfig;
  firestore: FirestoreConfig;
}

export interface CloudFunctionsConfig {
  endpoint: string;
  location: string;
}

export interface StripeConfig {
  apiVersion: string;
  apiKey: string;
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
