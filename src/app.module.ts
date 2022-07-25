import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAppCheckGuard } from '@core/firebase-app-check.guard';
import { TypesenseModule } from '@typesense/typesense.module';
import { GooglePlacesModule } from '@google-places/google-places.module';
import { StripeModule } from './stripe/stripe.module';

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

    CloudTasksModule.forRoot(),

    AuthModule,
    PaymentsModule,
    ClubsModule,
    EventsModule,
    EventTicketsModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: FirebaseAppCheckGuard,
    },
  ],
})
export class AppModule {}
