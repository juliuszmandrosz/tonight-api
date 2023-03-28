import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsResolver } from './tickets.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PubSubModule } from '../pub-sub/PubSub.module';

@Module({
  imports: [PrismaModule, PubSubModule],
  providers: [TicketsResolver, TicketsService],
})
export class TicketsModule {}
