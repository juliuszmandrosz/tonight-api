import { ConfigTemplate } from "@config/config-template";

// PROD
// export default () =>
//   ({
//     port: parseInt(process.env.PORT) || 3000,
//     serviceFee: 0.04,
//     normalEventFee: 0.08,
//     exclusiveEventFee: 0.04,
//     cloudFunctions: {
//       location: 'europe-central2',
//       endpoint: 'https://europe-central2-tonight-raver.cloudfunctions.net/',
//     },
//     stripe: {
//       apiVersion: '2020-08-27',
//       apiKey:
//         'REDACTED',
//     },
//     firestore: {
//       apiKey: 'REDACTED',
//       authDomain: 'tonight-raver.firebaseapp.com',
//       projectId: 'tonight-raver',
//       storageBucket: 'tonight-raver.appspot.com',
//       messagingSenderId: '98730591004',
//       appId: '1:98730591004:web:c079dca8cd340444a0b0d9',
//       measurementId: 'G-B56FR6HJF0',
//     },
//     typesense: {
//       apiKey: 'REDACTED',
//       clusterId: 't7uo1nq0adlipy32p-1.a1.typesense.net',
//     },
//     googlePlaces: {
//       apiKey: 'REDACTED',
//     },
//   } as ConfigTemplate);

//QA
// export default () =>
//   ({
//     port: parseInt(process.env.PORT) || 3000,
//     serviceFee: 0.04,
//     normalEventFee: 0.08,
//     exclusiveEventFee: 0.04,
//     cloudFunctions: {
//       location: 'europe-central2',
//       endpoint: 'https://europe-central2-tonight-qa.cloudfunctions.net/',
//     },
//     stripe: {
//       apiVersion: '2020-08-27',
//       apiKey:
//         'REDACTED',
//     },
//     firestore: {
//       apiKey: 'REDACTED',
//       authDomain: 'tonight-qa.firebaseapp.com',
//       projectId: 'tonight-qa',
//       storageBucket: 'tonight-qa.appspot.com',
//       messagingSenderId: '860373834856',
//       appId: '1:860373834856:web:230cdf369e3f2a34446fdd',
//       measurementId: 'G-W8QFFD3LYT',
//     },
//   } as ConfigTemplate);

// DEV
export default () =>
  ({
    port: parseInt(process.env.PORT) || 3000,
    serviceFee: 0.04,
    normalEventFee: 0.08,
    exclusiveEventFee: 0.04,
    cloudFunctions: {
      location: 'europe-central2',
      endpoint: 'https://europe-central2-raver-1fec4.cloudfunctions.net/',
    },
    stripe: {
      apiVersion: '2020-08-27',
      apiKey:
        'REDACTED',
    },
    firestore: {
      apiKey: 'REDACTED',
      authDomain: 'raver-1fec4.firebaseapp.com',
      projectId: 'raver-1fec4',
      storageBucket: 'raver-1fec4.appspot.com',
      messagingSenderId: '133839090627',
      appId: '1:133839090627:web:5d19c780f20b4f21e1c376',
      measurementId: 'G-EWR90F10GE',
    },
    typesense: {
      apiKey: 'REDACTED',
      clusterId: '1l4qvzr2emg60kcyp-1.a1.typesense.net',
    },
    googlePlaces: {
      apiKey: 'REDACTED',
    },
    redis: {
      port: 6379,
      host: 'localhost',
    },
  } as ConfigTemplate);
