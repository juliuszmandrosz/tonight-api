# Tonight API

> **Status:** this project is no longer developed or maintained. The code is published as-is for
> reference. Credentials that were once committed were removed from the whole history.

## Overview

REST API for the [Tonight apps](https://github.com/juliuszmandrosz/tonight-apps), a nightlife
platform for discovering events and clubs, buying tickets and collecting rewards. It works together with
the [Tonight Cloud Functions](https://github.com/juliuszmandrosz/RaverCloudFunctions) backend
(Firestore triggers, Stripe webhooks, refunds and security rules).

## Tech Stack

- **Framework**: NestJS (Node.js, TypeScript)
- **Database**: Cloud Firestore
- **Payments**: Stripe (payment sheets, customers, ticket reservations)
- **Commerce**: Shopify (rewards marketplace)
- **Search**: Typesense / Algolia
- **Background jobs**: Google Cloud Tasks
- **Other integrations**: Google Places
- **Runtime**: Docker

## Modules

`auth`, `events`, `event-tickets`, `clubs`, `payments`, `stripe`, `discounts`, `products`,
`shopify`, `typesense`, `cloud-tasks`, `google-places`, `wall-photos`, `firestore`

## Getting Started

```bash
npm install
npm run start:dev
```

Configuration is read from environment variables:

```dotenv
PORT=
SERVICE_FEE=
CLOUD_FUNCTIONS_LOCATION=
CLOUD_FUNCTIONS_ENDPOINT=
STRIPE_API_VERSION=
STRIPE_API_KEY=
FIRESTORE_API_KEY=
FIRESTORE_AUTH_DOMAIN=
FIRESTORE_PROJECT_ID=
FIRESTORE_STORAGE_BUCKET=
FIRESTORE_MESSAGING_SENDER_ID=
FIRESTORE_APP_ID=
FIRESTORE_MEASUREMENT_ID=
```

## License

Released under the [MIT License](LICENSE).
