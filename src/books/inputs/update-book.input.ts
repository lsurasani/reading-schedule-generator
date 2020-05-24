import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateBookInput {
  @Field(() => ID)
  id: string;
  @Field({ nullable: true })
  title: string;
  @Field({ nullable: true })
  author: string;
  @Field(() => Int, { nullable: true })
  pages: number;
  @Field({ nullable: true })
  dueDate: Date;
  @Field({ nullable: true })
  startDate: Date;
  @Field({ nullable: true })
  isbn: string;
}
