import * as mongoose from 'mongoose';

export const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  pages: { type: Number, required: true },
  dueDate: { type: Date },
  startDate: { type: Date },
  isbn: { type: String },
});
