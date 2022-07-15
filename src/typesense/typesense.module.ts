import { DynamicModule, Module } from '@nestjs/common';
import { AppConfigService } from '@config/app-config.service';
import { TypesenseConfig } from '@config/config-template';
import {
  TypesenseClientProvider,
  TypesenseOptionsProvider,
} from './typesense-providers';
import Typesense from 'typesense';

type TypesenseModuleOptions = {
  imports: any[];
  useFactory: (appConfigService: AppConfigService) => TypesenseConfig;
  inject: any[];
};

@Module({})
export class TypesenseModule {
  static forRoot(options: TypesenseModuleOptions): DynamicModule {
    const optionsProvider = {
      provide: TypesenseOptionsProvider,
      useFactory: options.useFactory,
      inject: options.inject,
    };

    const typesenseClientProvider = {
      provide: TypesenseClientProvider,
      useFactory: (config: TypesenseConfig) =>
        new Typesense.Client({
          nodes: [
            {
              protocol: 'https',
              host: config.clusterId,
              port: 443,
            },
          ],
          apiKey: config.apiKey,
          numRetries: 3,
          connectionTimeoutSeconds: 10,
        }),
      inject: [TypesenseOptionsProvider],
    };

    return {
      global: true,
      module: TypesenseModule,
      imports: options.imports,
      providers: [optionsProvider, typesenseClientProvider],
      exports: [typesenseClientProvider],
    };
  }
}
