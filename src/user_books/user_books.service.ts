import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserBook } from './user_book.model';
import { User } from '../users/user.model';
import { CreateUserBookInput } from './inputs/create-user_book.input';
import { UpdateUserBookInput } from './inputs/update-user_book.input';
import { CreateUserBookFromBookInput } from './inputs/create-user_book_from_book.input';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';
import { Book } from 'src/books/book.model';
import { CreateUserBookFromIsbnInput } from './inputs/create-user_book_from_isbn.input';

@Injectable()
export class UserBooksService {
  private userBooks: UserBook[] = [];

  constructor(
    @InjectModel('UserBook') private readonly userBookModel: Model<UserBook>,
    private booksService: BooksService,
    private usersService: UsersService,
  ) {}

  async createFromBook(input: CreateUserBookFromBookInput, user: User) {
    const book = await this.booksService.create(input);
    if (!book) {
      throw new Error("Book couldn't be created");
    }
    return await this.create(
      {
        bookId: book.id,
        startDate: input.startDate,
        endDate: input.endDate,
        status: null,
      },
      book,
      user,
    );
  }

  async createFromIsbn(input: CreateUserBookFromIsbnInput, user: User) {
    const book = await this.booksService.findOrCreateBookByIsbn(input.isbn);
    if (!book) {
      throw new Error("Book couldn't be created");
    }
    const data: CreateUserBookInput = {
      bookId: book.id,
      status: null,
      startDate: null,
      endDate: null,
    };
    if (input.startDate && input.endDate) {
      this.validateInputDates(input.startDate, input.endDate);
      data.startDate = input.startDate;
      data.endDate = input.endDate;
    }
    return await this.create(data, book, user);
  }

  async updateUserBook(input: UpdateUserBookInput) {
    const userBook = await this.findUserBookById(input.id);
    this.validateInputDates(input.startDate, input.endDate);
    if (userBook) {
      userBook.startDate = input.startDate;
      userBook.endDate = input.endDate;
      return await userBook.save();
    }
  }

  async create(input: CreateUserBookInput, book: Book, user: User) {
    const fullBook = book
      ? book
      : await this.booksService.findBook(input.bookId);
    const fullUser = await this.usersService.getUserById(user.id);
    const inputWithUser = {
      ...input,
      user: fullUser,
      book: fullBook,
    };
    this.validateInputDates(input.startDate, input.endDate);
    return await this.userBookModel(inputWithUser).save();
  }

  async get(bookId: string, userId: string) {
    const book = await this.booksService.findBook(bookId);
    const user = await this.usersService.getUserById(userId);
    return await this.findUserBook(book, user);
  }

  async getAllCurrent(userId: string) {
    const user = await this.usersService.getUserById(userId);
    return await this.findAllCurrentUserBooks(user);
  }

  async getAllUpcoming(userId: string) {
    const user = await this.usersService.getUserById(userId);
    return await this.findAllUpcomingUserBooks(user);
  }

  async getAllUnscheduled(userId: string) {
    const user = await this.usersService.getUserById(userId);
    return await this.findAllUnscheduledUserBooks(user);
  }

  private async findUserBook(book: Book, user: User) {
    return await this.userBookModel.findOne({ book, user });
  }

  private async findUserBookById(id: string) {
    return await this.userBookModel.findOne({ _id: id });
  }

  private async findAllUpcomingUserBooks(user: User) {
    return await this.userBookModel.find({
      user,
      startDate: { $gt: new Date() },
    });
  }

  private async findAllCurrentUserBooks(user: User) {
    return await this.userBookModel.find({
      user,
      endDate: { $gt: new Date() },
      startDate: { $lt: new Date() },
    });
  }

  private async findAllUnscheduledUserBooks(user: User) {
    return await this.userBookModel.find({
      user,
      endDate: null,
      startDate: null,
    });
  }

  private validateInputDates(startDate = null, endDate = null) {
    if (!startDate && !endDate) {
      return true;
    }
    if (startDate && !endDate) {
      throw new Error('Please enter an end date');
    } else if (endDate && !startDate) {
      throw new Error('Please enter a start date');
    }

    if (
      isNaN(new Date(startDate).getTime()) ||
      isNaN(new Date(endDate).getTime())
    ) {
      throw new Error('Invalid Dates');
    } else if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
      throw new Error('End date must be after start date');
    }

    return true;
  }

  private isValidDate(dateString) {
    return !isNaN(new Date(dateString).getTime());
  }
}
