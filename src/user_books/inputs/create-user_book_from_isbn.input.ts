import { InputType, Field } from '@nestjs/graphql';
import { CreateBookFromIsbnInput } from 'src/books/inputs/create-book_from_isbn.input';

@InputType()
export class CreateUserBookFromIsbnInput extends CreateBookFromIsbnInput {
  @Field({ nullable: true })
  startDate: Date;

  @Field({ nullable: true })
  endDate: Date;
}
