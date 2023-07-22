import { Inject, Injectable } from '@nestjs/common';
import { ShopifyProvider } from '@shopify/shopify.providers';
import * as Shopify from 'shopify-api-node';

@Injectable()
export class ProductsService {
  constructor(@Inject(ShopifyProvider) private shopify: Shopify) {}

  async getProducts() {
    return await this.shopify.currency.list();
  }
}
