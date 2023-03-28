import { CreateUserInput } from './create-user.input';
import { InputType, PartialType } from '@nestjs/graphql';
import { StringInput } from '@decorators/string-input.decorator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @StringInput()
  id: string;
}
