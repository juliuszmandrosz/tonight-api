import { ArgsType } from '@nestjs/graphql';
import { StringInput } from '@decorators/string-input.decorator';

@ArgsType()
export class SubscribeToAllTicketsArgs {
  @StringInput()
  userId: string;
}
