import { InputType, Field } from '@nestjs/graphql';
import { AllowedBookStatuses } from 'src/enums/allowed-book-statuses.enum';

@InputType()
export class CreateUserBookInput {
  @Field()
  bookId: string;

  @Field({ nullable: true })
  startDate: Date;

  @Field({ nullable: true })
  endDate: Date;

  @Field(() => AllowedBookStatuses, { nullable: true })
  status: AllowedBookStatuses;
}
