import { Injectable, NotFoundException, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './book.model';
import { CreateBookInput } from './inputs/create-book.input';
import { UpdateBookInput } from './inputs/update-book.input';

interface AuthorLayout {
  url: string;
  name: string;
}

@Injectable()
export class BooksService {
  private books: Book[] = [];

  constructor(
    @InjectModel('Book') private readonly bookModel: Model<Book>,
    private http: HttpService,
  ) {}

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
    return savedBook;
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
      isbn: book.isbn,
    };
  }

  async findBook(id: string): Promise<Book> {
    let book: Book;
    try {
      book = await this.bookModel.findById(id);
    } catch (error) {}
    if (!book) {
      throw new NotFoundException('Could not find book.');
    }
    return book;
  }

  async findOrCreateBookByIsbn(isbn: string) {
    let book: Book;
    book = await this.bookModel.findOne({ isbn });
    if (!book) {
      book = await this.createBookIsbn(isbn);
    }
    return book;
  }

  private async createBookIsbn(isbn: string) {
    const response = await this.apiBook(isbn);
    const bookData = response.data[`ISBN:${isbn}`];
    if (!bookData) {
      throw new Error("That book couldn't be found.");
    }
    const authors = bookData.authors
      .map((author: AuthorLayout) => author.name)
      .join(', ');
    const createBookData: CreateBookInput = {
      title: bookData.title,
      author: authors,
      pages: bookData.number_of_pages ? bookData.number_of_pages : 0,
      isbn: isbn,
    };
    return this.create(createBookData);
  }

  private async apiBook(isbn: string) {
    return this.http
      .get(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
      )
      .toPromise();
  }
}
