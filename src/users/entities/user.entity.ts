import { Field, ObjectType } from '@nestjs/graphql';
import { User as PrismaUser } from '@prisma/client';
import { Ticket } from '@tickets/entities/ticket.entity';

@ObjectType()
export class User implements PrismaUser {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  locale: string;

  @Field(() => [Ticket])
  tickets: Ticket[];
}
