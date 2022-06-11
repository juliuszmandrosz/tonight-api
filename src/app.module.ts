import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeModule } from 'nestjs-stripe';
import { PaymentsModule } from '@payments/payments.module';
import { ClubsModule } from '@clubs/clubs.module';
import { EventsModule } from '@events/events.module';
import { EventTicketsModule } from '@event-tickets/event-tickets.module';
import { FirestoreModule } from '@core/firestore-module';
import { FirestoreRepositoriesModule } from '@firestore-repositories/firestore-repositories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        keyFilename: 'src/key.json',
        projectId: 'NAME',
        apiKey: 'KEY',
      }),
      inject: [ConfigService],
    }),

    StripeModule.forRoot({
      apiKey: 'KEY',
      apiVersion: '2020-08-27',
    }),
    PaymentsModule,
    ClubsModule,
    EventsModule,
    EventTicketsModule,
    FirestoreRepositoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
