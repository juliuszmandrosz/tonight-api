export interface ConfigTemplate {
  serviceFee: number;
  stripe: StripeConfig;
  firestore: FirestoreConfig;
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
