import { Field, Int, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Book {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  author: string;

  @Field(() => Int)
  pages: number;

  @Field({ nullable: true })
  isbn: string;
}
