import { InputType } from '@nestjs/graphql';
import { StringInput } from '@decorators/string-input.decorator';
import { NumberInput } from '@decorators/number-input.decorator';

@InputType()
export class CreateTicketInput {
  @NumberInput()
  price: number;

  @StringInput()
  userId: string;
}
