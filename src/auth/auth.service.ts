import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.getUser(username);
    if (!user) {
      throw Error('Incorrect email or password');
    } else if (await bcrypt.compare(password, user.password)) {
      const accessToken = this.jwtService.sign({
        sub: user._id,
        username: user.username,
      });
      console.log(accessToken);
      return user;
    }

    throw Error('Incorrect email or password');
  }

  async signup({ username, password, email }) {
    const protectedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      username,
      password: protectedPassword,
      email,
    });

    if (user) {
      const accessToken = this.jwtService.sign({
        sub: user._id,
        username: user.username,
      });
      console.log(accessToken);
    }

    return user;
  }

  profile(userId: string) {
    return this.usersService.getUserById(userId);
  }
}
