import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from '@payments/payments.module';
import { ClubsModule } from '@clubs/clubs.module';
import { EventsModule } from '@events/events.module';
import { EventTicketsModule } from '@event-tickets/event-tickets.module';
import { FirestoreModule } from '@firestore/firestore.module';
import config from '@config/config';
import { AppConfigModule } from '@config/app-config.module';
import { AppConfigService } from '@config/app-config.service';
import { CoreModule } from '@core/core.module';
import { CloudTasksModule } from '@cloud-tasks/cloud-tasks.module';
import { AuthModule } from '@auth/auth.module';
import { GooglePlacesModule } from '@google-places/google-places.module';
import { StripeModule } from '@stripe/stripe.module';
import { ShopifyModule } from '@shopify/shopify.module';
import { ProductsModule } from '@products/products.module';
import { DiscountsModule } from '@discounts/discounts.module';
import { AlgoliaModule } from '@algolia/algolia.module';
import { TypesenseModule } from '@typesense/typesense.module';
import { AlgoliaDataServiceModule } from '@data-services/algolia/algolia-data-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),

    AlgoliaModule.forRoot({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) =>
        appConfigService.getAlgoliaConfig(),
      inject: [AppConfigService],
    }),

    TypesenseModule.forRoot({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) =>
        appConfigService.getTypesenseConfig(),
      inject: [AppConfigService],
    }),

    FirestoreModule.forRoot({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) =>
        appConfigService.getFirestoreConfig(),
      inject: [AppConfigService],
    }),

    GooglePlacesModule.forRoot({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) =>
        appConfigService.getGooglePlacesConfig(),
      inject: [AppConfigService],
    }),

    StripeModule.forRoot({
      imports: [AppConfigModule],
      useFactory: (appConfigService) => appConfigService.getStripeConfig(),
      inject: [AppConfigService],
    }),

    ShopifyModule.forRoot({
      imports: [AppConfigModule],
      useFactory: (appConfigService) => appConfigService.getShopifyConfig(),
      inject: [AppConfigService],
    }),

    CloudTasksModule.forRoot(),

    AuthModule,
    PaymentsModule,
    ClubsModule,
    EventsModule,
    EventTicketsModule,
    CoreModule,
    ProductsModule,
    DiscountsModule,
    AlgoliaDataServiceModule,
  ],
})
export class AppModule {}
