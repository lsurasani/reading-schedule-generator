import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './book.model';
import { CreateBookInput } from './inputs/create-book.input';
import { UpdateBookInput } from './inputs/update-book.input';

@Injectable()
export class BooksService {
  private books: Book[] = [];

  constructor(@InjectModel('Book') private readonly bookModel: Model<Book>) {}

  async create(bookInput: CreateBookInput): Promise<Book> {
    const newBook = new this.bookModel(bookInput);

    return await newBook.save();
  }

  async getBook(id: string) {
    const book = await this.findBook(id);
    return this.prettyBook(book);
  }

  async getBooks(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async update(updates: UpdateBookInput) {
    const book = await this.findBook(updates.id);
    Object.keys(updates).forEach(k => {
      book[k] = updates[k];
    });
    const savedBook = await this.bookModel(book).save();
    return this.prettyBook(savedBook);
  }

  async remove(id: string) {
    const toRemove = await this.findBook(id);
    const result = await this.bookModel.deleteOne({ _id: id }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find book.');
    } else {
      return toRemove;
    }
  }

  private prettyBook(book: Book): {} {
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      pages: book.pages,
    };
  }

  private async findBook(id: string): Promise<Book> {
    let book: Book;
    try {
      book = await this.bookModel.findById(id);
    } catch (error) {}
    if (!book) {
      throw new NotFoundException('Could not find book.');
    }
    return book;
  }
}
