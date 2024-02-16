import { DynamicModule, Module } from '@nestjs/common';
import { AppConfigService } from '@config/app-config.service';
import { ShopifyConfig } from '@config/config-template';
import {
  ShopifyOptionsProvider,
  ShopifyProvider,
} from '@shopify/shopify.providers';
import * as Shopify from 'shopify-api-node';

type ShopifyModuleOptions = {
  imports: any[];
  useFactory: (appConfigService: AppConfigService) => ShopifyConfig;
  inject: any[];
};

@Module({})
export class ShopifyModule {
  static forRoot(options: ShopifyModuleOptions): DynamicModule {
    const optionsProvider = {
      provide: ShopifyOptionsProvider,
      useFactory: options.useFactory,
      inject: options.inject,
    };

    const shopifyProvider = {
      provide: ShopifyProvider,
      useFactory: (config: ShopifyConfig) =>
        new Shopify({
          shopName: config.shopName,
          // apiKey: config.apiKey,
          accessToken: config.accessToken,
        }),
      inject: [ShopifyOptionsProvider],
    };

    return {
      global: true,
      module: ShopifyModule,
      imports: options.imports,
      providers: [optionsProvider, shopifyProvider],
      exports: [shopifyProvider],
    };
  }
}
