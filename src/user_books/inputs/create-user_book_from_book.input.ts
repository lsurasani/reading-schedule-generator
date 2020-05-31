import { InputType, Field } from '@nestjs/graphql';
import { CreateBookInput } from 'src/books/inputs/create-book.input';

@InputType()
export class CreateUserBookFromBookInput extends CreateBookInput {
  @Field({ nullable: true })
  startDate: Date;

  @Field({ nullable: true })
  endDate: Date;
}
