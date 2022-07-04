import { Module, DynamicModule } from '@nestjs/common';
import {
  FirestoreAppCheckProvider,
  FirestoreAppProvider,
  FirestoreAuthProvider,
  FirestoreDatabaseProvider,
  FirestoreOptionsProvider,
} from './firestore-providers';
import { initializeApp } from 'firebase-admin/app';
import { AppConfigService } from '@config/app-config.service';
import { FirestoreConfig } from '@config/config-template';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getAppCheck } from 'firebase-admin/app-check';

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

    const authProvider = {
      provide: FirestoreAuthProvider,
      useFactory: (app) => getAuth(app),
      inject: [FirestoreAppProvider],
    };

    const appCheckProvider = {
      provide: FirestoreAppCheckProvider,
      useFactory: (app) => getAppCheck(app),
      inject: [FirestoreAppProvider],
    };
    return {
      global: true,
      module: FirestoreModule,
      imports: options.imports,
      providers: [
        optionsProvider,
        dbProvider,
        appProvider,
        authProvider,
        appCheckProvider,
      ],
      exports: [dbProvider, appProvider, authProvider, appCheckProvider],
    };
  }
}
