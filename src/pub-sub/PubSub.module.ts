import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Module } from '@nestjs/common';
import { AppConfigService } from '@config/app-config.service';
import { AppConfigModule } from '@config/app-config.module';
import { PubSubService } from './pub-sub.service';

export const PubSubProvider = 'pubSub';

@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: PubSubService,
      useFactory: (configService: AppConfigService) =>
        new PubSubService(
          new RedisPubSub({
            connection: {
              host: configService.getRedisConfig().host,
              port: configService.getRedisConfig().port,
            },
          }),
        ),
      inject: [AppConfigService],
    },
  ],
  exports: [PubSubService],
})
export class PubSubModule {}
