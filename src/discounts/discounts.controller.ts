import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dtos/create-discount.dto';
import { FirebaseAuthGuard } from '@core/firebase-auth.guard';
import { UserMarketplaceDiscount } from './entities/user-marketplace-discount.entity';

@UseGuards(FirebaseAuthGuard)
@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Post()
  discounts(@Body() dto: CreateDiscountDto): Promise<UserMarketplaceDiscount> {
    return this.discountsService.createDiscount(dto);
  }

  // @Post('createPriceRule') createPriceRule(): Promise<number> {
  //   return this.discountsService.createPriceRule();
  // }
}
