import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from 'nestjs-stripe';
import { PaymentsModule } from '@payments/payments.module';
import { ClubsModule } from '@clubs/clubs.module';
import { EventsModule } from '@events/events.module';
import { EventTicketsModule } from '@event-tickets/event-tickets.module';
import { FirestoreModule } from '@firestore/firestore.module';
import config from '@config/config';
import { AppConfigModule } from '@config/app-config.module';
import { AppConfigService } from '@config/app-config.service';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['src/config/.dev.env'],
      load: [config],
    }),

    FirestoreModule.forRoot({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) =>
        appConfigService.getFirestoreConfig(),
      inject: [AppConfigService],
    }),

    StripeModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (appConfigService) => ({
        apiKey: appConfigService.getStripeConfig().apiKey,
        apiVersion: appConfigService.getStripeConfig().apiVersion,
      }),
      inject: [AppConfigService],
    }),
    PaymentsModule,
    ClubsModule,
    EventsModule,
    EventTicketsModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
