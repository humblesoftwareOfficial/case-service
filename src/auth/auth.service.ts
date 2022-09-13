/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Result, succeed } from '../config/htt-response';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    // private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto): Promise<Result> {
    const user = await this.validateUser(authDto);
    const payload = {
      userId: user._id,
      code: user.code,
    };
    const data = {
      ...user,
      _id: undefined,
      password: undefined,
      access_token: this.jwtService.sign(payload),
    };
    return succeed({ data });
  }

  async validateUser(authDto: AuthDto) {
    const { email, password, phone } = authDto;
    const user = null;
    // await this.usersService.__findByEmailOrLogin({
    //   email,
    //   phone,
    // });
    if (!user) {
      throw new HttpException(
        `Authentication failed. Please check your login informations and try again`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Wrong password . Please Try again.');
    }
    return user;
  }
}
