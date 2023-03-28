import { DynamicModule, Module } from '@nestjs/common';
import { AppConfigService } from '@config/app-config.service';
import { StripeConfig } from '@config/config-template';
import { StripeOptionsProvider, StripeProvider } from './stripe-providers';
import { Stripe } from 'stripe';

type StripeModuleOptions = {
  imports: any[];
  useFactory: (appConfigService: AppConfigService) => StripeConfig;
  inject: any[];
};

@Module({})
export class StripeModule {
  static forRoot(options: StripeModuleOptions): DynamicModule {
    const optionsProvider = {
      provide: StripeOptionsProvider,
      useFactory: options.useFactory,
      inject: options.inject,
    };

    const stripeProvider = {
      provide: StripeProvider,
      useFactory: (config: StripeConfig) =>
        new Stripe(config.apiKey, { apiVersion: '2022-11-15' }),
      inject: [StripeOptionsProvider],
    };

    return {
      global: true,
      module: StripeModule,
      imports: options.imports,
      providers: [optionsProvider, stripeProvider],
      exports: [stripeProvider],
    };
  }
}
