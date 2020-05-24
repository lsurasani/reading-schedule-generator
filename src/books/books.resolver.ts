import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import { Book } from './book.model';
import { BooksService } from './books.service';
import { CreateBookInput } from './inputs/create-book.input';
import { UpdateBookInput } from './inputs/update-book.input';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private booksService: BooksService) {}

  @Query(() => Book)
  async getBook(@Args('id', { type: () => String }) id: string) {
    return this.booksService.getBook(id);
  }

  @Query(() => [Book])
  async books() {
    return this.booksService.getBooks();
  }

  @Mutation(() => Book)
  async createBook(@Args('inputData') inputData: CreateBookInput) {
    return this.booksService.create(inputData);
  }

  @Mutation(() => Book)
  async updateBook(@Args('inputData') inputData: UpdateBookInput) {
    return this.booksService.update(inputData);
  }

  @Mutation(() => Book)
  async removeBook(@Args('id', { type: () => String }) id: string) {
    return this.booksService.remove(id);
  }
}
