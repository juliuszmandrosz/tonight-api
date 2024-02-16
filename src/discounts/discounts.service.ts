import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FirestoreDataService } from '@data-services/firestore/firestore-data.service';
import { CreateDiscountDto } from './dtos/create-discount.dto';
import { DiscountFailure } from './types/discount-failure.type';
import { ShopifyProvider } from '@shopify/shopify.providers';
import Shopify from 'shopify-api-node';
import * as randomstring from 'randomstring';
import { UserMarketplaceDiscount } from './entities/user-marketplace-discount.entity';
import { firestore } from 'firebase-admin';
import Timestamp = firestore.Timestamp;

@Injectable()
export class DiscountsService {
  constructor(
    private readonly firestoreDataService: FirestoreDataService,
    @Inject(ShopifyProvider) private shopify: Shopify,
  ) {}

  async createDiscount(dto: CreateDiscountDto) {
    const user = await this.tryGetUser(dto.userId);
    const discount = await this.tryGetDiscount(dto.discountId);
    if (user.raverCoins < discount.price) {
      const response: DiscountFailure = 'insufficient-raver-coins';
      throw new HttpException(response, HttpStatus.FORBIDDEN);
    }
    const priceRule = await this.tryGetPriceRule(discount.priceRuleId);
    const discountCode = await this.shopify.discountCode.create(priceRule.id, {
      code: randomstring.generate(8),
    });
    try {
      return this.firestoreDataService.runTransaction<UserMarketplaceDiscount>(
        async (tx) => {
          const userRef = this.firestoreDataService.users.findReferenceById(
            user.id,
          );
          const userDiscountRef =
            this.firestoreDataService.userMarketplaceDiscounts.findReferenceById(
              user.id,
              discountCode.id.toString(),
            );
          user.raverCoins -= discount.price;
          const userDiscount = new UserMarketplaceDiscount({
            id: discountCode.id.toString(),
            code: discountCode.code,
            name: discount.name,
            marketplaceUrl: discount.marketplaceUrl,
            imageUrl: discount.imageUrl,
            description: discount.description,
            redeemedAt: Timestamp.now(),
          });
          tx.update(userRef, { ...user });
          tx.create(userDiscountRef, { ...userDiscount });
          return userDiscount;
        },
      );
    } catch (e) {
      console.log(e.response.body);
      await this.shopify.discountCode.delete(
        discount.priceRuleId,
        discountCode.id,
      );
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async createPriceRule() {
  //   try {
  //     const priceRule = await this.shopify.priceRule.create({
  //       title: 'Saszetka Vit2Go DRINK RECOVERY',
  //       target_type: 'line_item',
  //       value_type: 'percentage',
  //       value: '-100.0',
  //       customer_selection: 'all',
  //       target_selection: 'all',
  //       allocation_method: 'each',
  //       starts_at: '2023-09-20T00:00:00Z',
  //       usage_limit: 1,
  //     });
  //     console.log('Price Rule stworzone:', priceRule);
  //     return priceRule.id; // Zwróć ID reguły, które będziesz używać później
  //   } catch (e) {
  //     console.log('Błąd przy tworzeniu Price Rule:', e.response.body);
  //     throw e;
  //   }
  // }

  private async tryGetUser(userId: string) {
    const user = await this.firestoreDataService.users.findById(userId);
    if (!user) {
      const response: DiscountFailure = 'user-not-found';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  private async tryGetDiscount(discountId: string) {
    const discount =
      await this.firestoreDataService.marketplaceDiscounts.findById(discountId);
    if (!discount) {
      const response: DiscountFailure = 'discount-not-found';
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }
    return discount;
  }

  private async tryGetPriceRule(priceRuleId: number) {
    try {
      return this.shopify.priceRule.get(priceRuleId);
    } catch (e) {
      if (e.response.statusCode === 404) {
        const response: DiscountFailure = 'discount-not-found';
        throw new HttpException(response, HttpStatus.NOT_FOUND);
      }
      console.log(e.response.body);
      throw new HttpException(
        e.response.body,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
