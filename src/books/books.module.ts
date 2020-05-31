import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BooksService } from './books.service';
import { BookSchema } from './book.schema';
import { BooksResolver } from './books.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }])],
  providers: [BooksService, BooksResolver],
  exports: [BooksService],
})
export class BooksModule {}
