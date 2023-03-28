import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@users/entities/user.entity';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';
import { Decimal } from '@prisma/client/runtime';
import { Ticket as PrismaTicket } from '@prisma/client';

@ObjectType()
export class Ticket implements PrismaTicket {
  @Field()
  id: string;

  @Field(() => GraphQLDecimal)
  price: Decimal;

  @Field()
  isVip: boolean;

  @Field()
  isExpired: boolean;

  @Field()
  isReturnable: boolean;

  @Field()
  isReturned: boolean;

  @Field(() => User)
  user: User;

  @Field()
  userId: string;
}
