import { InputType } from '@nestjs/graphql';
import { StringInput } from '@decorators/string-input.decorator';
import { EmailInput } from '@decorators/email-input.decorator';

@InputType()
export class CreateUserInput {
  @StringInput()
  username: string;

  @EmailInput()
  email: string;

  @StringInput()
  locale: string;
}
