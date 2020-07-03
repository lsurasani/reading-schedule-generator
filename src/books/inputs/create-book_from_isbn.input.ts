import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBookFromIsbnInput {
  @Field()
  isbn: string;
}
