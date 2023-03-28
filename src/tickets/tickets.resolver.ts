import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
  Subscription,
} from '@nestjs/graphql';
import { TicketsService } from './tickets.service';
import { Ticket } from './entities/ticket.entity';
import { UpdateTicketInput } from './dtos/update-ticket.input';
import { CreateTicketInput } from '@tickets/dtos/create-ticket.input';
import { SubscribeToAllTicketsArgs } from '@tickets/dtos/subscribe-to-all-tickets.args';
import { PubSubService } from '../pub-sub/pub-sub.service';
import { PubSubEvent } from '../pub-sub/pub-sub-event.enum';

@Resolver(() => Ticket)
export class TicketsResolver {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly pubSubService: PubSubService,
  ) {}

  @ResolveField()
  user(@Root() ticket: Ticket) {
    return this.ticketsService.findOne(ticket.id).user();
  }

  @Query(() => [Ticket], { name: 'tickets' })
  findAll() {
    return this.ticketsService.findAll();
  }

  @Subscription(() => [Ticket], {
    name: PubSubEvent.ticketsUpdated.toString(),
    filter: (payload, variables) =>
      payload.ticketsUpdated.userId === variables.userId,
  })
  subscribeToAllTickets(@Args() args: SubscribeToAllTicketsArgs) {
    return this.pubSubService.subscribeToEvent(
      PubSubEvent.ticketsUpdated,
      args.userId,
    );
  }

  @Mutation(() => Ticket)
  createTicket(
    @Args('createTicketInput') createTicketInput: CreateTicketInput,
  ) {
    return this.ticketsService.create(createTicketInput);
  }

  @Mutation(() => Ticket)
  async updateTicket(
    @Args('updateTicketInput') updateTicketInput: UpdateTicketInput,
  ) {
    const result = await this.ticketsService.update(
      updateTicketInput.id,
      updateTicketInput,
    );

    // this.pubSubService.publishEvent<Ticket[]>(PubSubEvent.ticketsUpdated, await this.ticketsService.findAll(), )
    return result;
  }
}
