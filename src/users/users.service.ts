import { Injectable, NotFoundException, Dependencies } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { CreateUserInput } from './inputs/create-user.input';

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {
    this.userModel = userModel;
  }

  async create(userInput: CreateUserInput) {
    const newUser = new this.userModel(userInput);

    return await newUser.save();
  }

  async getUserById(id: string) {
    const user = await this.findUser(id);
    return user;
  }

  async getUser(username: string) {
    const user = await this.userModel.findOne({ username: username });
    return user;
  }

  private async findUser(id: string) {
    let user: User;
    try {
      user = await this.userModel.findById(id);
    } catch (error) {}
    if (!user) {
      throw new NotFoundException("Couldn't find that user!");
    }

    return user;
  }
}
