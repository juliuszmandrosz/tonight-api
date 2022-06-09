import { Test, TestingModule } from '@nestjs/testing';
import { TicketPaymentController } from './ticket-payment.controller';

describe('TicketPaymentController', () => {
  let controller: TicketPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketPaymentController],
    }).compile();

    controller = module.get<TicketPaymentController>(TicketPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
