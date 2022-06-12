export default () => ({
  serviceFee: parseFloat(process.env.SERVICE_FEE),
  stripe: {
    apiVersion: process.env.STRIPE_API_VERSION,
    apiKey: process.env.STRIPE_API_KEY,
  },
  firestore: {
    apiKey: process.env.FIRESTORE_API_KEY,
    authDomain: process.env.FIRESTORE_AUTH_DOMAIN,
    projectId: process.env.FIRESTORE_PROJECT_ID,
    storageBucket: process.env.FIRESTORE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIRESTORE_MESSAGING_SENDER_ID,
    appId: process.env.FIRESTORE_APP_ID,
    measurementId: process.env.FIRESTORE_MEASUREMENT_ID,
  },
});
