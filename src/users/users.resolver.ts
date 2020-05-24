import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import { User } from './user.model';
import { UsersService } from './users.service';
import { CreateUserInput } from './inputs/create-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  async getUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.getUserById(id);
  }

  @Mutation(() => User)
  async createUser(@Args('inputData') inputData: CreateUserInput) {
    return this.usersService.create(inputData);
  }
}
