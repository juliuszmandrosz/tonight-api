import { DynamicModule, Module } from '@nestjs/common';
import { AppConfigService } from '@config/app-config.service';
import { AlgoliaConfig } from '@config/config-template';
import {
  AlgoliaClientProvider,
  AlgoliaOptionsProvider,
} from './algolia-providers';
import algoliasearch from 'algoliasearch';

type AlgoliaModuleOptions = {
  imports: any[];
  useFactory: (appConfigService: AppConfigService) => AlgoliaConfig;
  inject: any[];
};

@Module({})
export class AlgoliaModule {
  static forRoot(options: AlgoliaModuleOptions): DynamicModule {
    const optionsProvider = {
      provide: AlgoliaOptionsProvider,
      useFactory: options.useFactory,
      inject: options.inject,
    };

    const algoliaClientProvider = {
      provide: AlgoliaClientProvider,
      useFactory: (config: AlgoliaConfig) =>
        algoliasearch(config.appId, config.apiKey),
      inject: [AlgoliaOptionsProvider],
    };

    return {
      global: true,
      module: AlgoliaModule,
      imports: options.imports,
      providers: [optionsProvider, algoliaClientProvider],
      exports: [algoliaClientProvider],
    };
  }
}
