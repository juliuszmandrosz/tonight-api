import { Injectable } from '@nestjs/common';
import { PubSubEvent } from './pub-sub-event.enum';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Injectable()
export class PubSubService {
  constructor(private pubSub: RedisPubSub) {}

  subscribeToEvent(event: PubSubEvent, args?: string) {
    return this.pubSub.asyncIterator(this.getTriggerName(event, args));
  }

  publishEvent<T>(event: PubSubEvent, data: T, resourceId?: string) {
    const trigger = this.getTriggerName(event, resourceId);
    const payload = {};
    payload[trigger] = data;
    return this.pubSub.publish(trigger, payload);
  }

  private getTriggerName(event: PubSubEvent, args?: string) {
    let trigger = event.toString();
    if (args) {
      trigger += args;
    }
    return trigger;
  }
}
