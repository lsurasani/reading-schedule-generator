import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from '../users/user.model';
import { Book } from '../books/book.model';
import { AllowedBookStatuses } from 'src/enums/allowed-book-statuses.enum';

@ObjectType()
export class UserBook {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;

  @Field(() => Book)
  book: Book;

  @Field({ nullable: true })
  startDate: Date;

  @Field({ nullable: true })
  endDate: Date;

  @Field(() => AllowedBookStatuses, { nullable: true })
  status: AllowedBookStatuses;
}
