import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserBookSchema } from './user_book.schema';
import { UserBooksService } from './user_books.service';
import { UserBooksResolver } from './user_books.resolver';
import { BooksModule } from 'src/books/books.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'UserBook', schema: UserBookSchema }]),
    BooksModule,
    UsersModule,
  ],
  providers: [UserBooksService, UserBooksResolver],
})
export class UserBooksModule {}
