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
import { TypesenseModule } from '@typesense/typesense.module';
import { GooglePlacesModule } from '@google-places/google-places.module';
import { StripeModule } from './stripe/stripe.module';
import { GraphqlModule } from './graphql/graphql.module';
import { UsersModule } from '@users/users.module';
import { TicketsModule } from '@tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
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
      useFactory: (appConfigService) => ({
        apiKey: appConfigService.getStripeConfig().apiKey,
        apiVersion: appConfigService.getStripeConfig().apiVersion,
      }),
      inject: [AppConfigService],
    }),

    GraphqlModule,

    CloudTasksModule.forRoot(),

    AuthModule,
    PaymentsModule,
    ClubsModule,
    EventsModule,
    EventTicketsModule,
    CoreModule,
    // PubSubModule,
    UsersModule,
    TicketsModule,
  ],
})
export class AppModule {}
