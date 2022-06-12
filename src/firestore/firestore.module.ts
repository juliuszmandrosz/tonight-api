import { Module, DynamicModule } from '@nestjs/common';
import {
  FirestoreAppProvider,
  FirestoreDatabaseProvider,
  FirestoreOptionsProvider,
} from './firestore-providers';
import { getFirestore } from 'firebase/firestore/lite';
import { initializeApp } from 'firebase/app';
import { AppConfigService } from '@config/app-config.service';
import { FirestoreConfig } from '@config/config-template';

type FirestoreModuleOptions = {
  imports: any[];
  useFactory: (appConfigService: AppConfigService) => FirestoreConfig;
  inject: any[];
};

@Module({})
export class FirestoreModule {
  static forRoot(options: FirestoreModuleOptions): DynamicModule {
    const optionsProvider = {
      provide: FirestoreOptionsProvider,
      useFactory: options.useFactory,
      inject: options.inject,
    };

    const appProvider = {
      provide: FirestoreAppProvider,
      useFactory: (config: FirestoreConfig) => initializeApp(config),
      inject: [FirestoreOptionsProvider],
    };

    const dbProvider = {
      provide: FirestoreDatabaseProvider,
      useFactory: (app) => getFirestore(app),
      inject: [FirestoreAppProvider],
    };

    return {
      global: true,
      module: FirestoreModule,
      imports: options.imports,
      providers: [optionsProvider, dbProvider, appProvider],
      exports: [dbProvider, appProvider],
    };
  }
}
