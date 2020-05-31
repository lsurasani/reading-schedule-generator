import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

import { UserBook } from './user_book.model';
import { User } from '../users/user.model';
import { UserBooksService } from './user_books.service';
import { CreateUserBookInput } from './inputs/create-user_book.input';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateUserBookFromBookInput } from './inputs/create-user_book_from_book.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => UserBook)
export class UserBooksResolver {
  constructor(private userBooksService: UserBooksService) {}

  @Query(() => UserBook)
  async getUserBook(
    @CurrentUser() user: User,
    @Args('bookId', { type: () => String }) bookId: string,
  ) {
    const result = this.userBooksService.get(bookId, user.id);
    return result;
  }

  @Query(() => [UserBook])
  async getCurrentUserBooks(@CurrentUser() user: User) {
    return this.userBooksService.getAllCurrent(user.id);
  }

  @Query(() => [UserBook])
  async getUpcomingUserBooks(@CurrentUser() user: User) {
    return this.userBooksService.getAllUpcoming(user.id);
  }

  @Query(() => [UserBook])
  async getUnscheduledUserBooks(@CurrentUser() user: User) {
    return this.userBooksService.getAllUnscheduled(user.id);
  }

  @Mutation(() => UserBook)
  async createUserBook(
    @CurrentUser() user: User,
    @Args('input') input: CreateUserBookInput,
  ) {
    return this.userBooksService.create(input, null, user);
  }

  @Mutation(() => UserBook)
  async createUserBookFromBook(
    @CurrentUser() user: User,
    @Args('input') input: CreateUserBookFromBookInput,
  ) {
    const result = this.userBooksService.createFromBook(input, user);
    return result;
  }
}
