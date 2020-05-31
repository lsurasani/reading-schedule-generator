import * as mongoose from 'mongoose';
import { UserSchema } from '../users/user.schema';
import { BookSchema } from '../books/book.schema';

export const UserBookSchema = new mongoose.Schema({
  user: { type: UserSchema, required: true },
  book: { type: BookSchema, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String },
});
