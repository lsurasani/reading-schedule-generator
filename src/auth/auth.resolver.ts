import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { User } from '../users/user.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { LoginInput } from './inputs/login.input';
import { CreateUserInput } from 'src/users/inputs/create-user.input';
import { AuthService } from './auth.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  whoAmI(@CurrentUser() user: User) {
    return this.authService.profile(user.id);
  }

  @Mutation(() => User)
  loginUser(@Args('loginInput') { username, password }: LoginInput) {
    return this.authService.login(username, password);
  }

  @Mutation(() => User)
  signUpUser(@Args('signUpInput') signUpInput: CreateUserInput) {
    return this.authService.signup(signUpInput);
  }
}
