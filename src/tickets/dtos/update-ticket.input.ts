import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTicketInput } from '@tickets/dtos/create-ticket.input';
import { StringInput } from '@decorators/string-input.decorator';

@InputType()
export class UpdateTicketInput extends PartialType(CreateTicketInput) {
  @StringInput()
  id: string;
}
