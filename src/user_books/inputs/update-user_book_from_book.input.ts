import { InputType, Field } from '@nestjs/graphql';
import { UpdateBookInput } from 'src/books/inputs/update-book.input';

@InputType()
export class UpdateUserBookFromBookInput extends UpdateBookInput {
  @Field({ nullable: true })
  startDate: Date;

  @Field({ nullable: true })
  endDate: Date;
}
